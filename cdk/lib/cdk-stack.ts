import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as cdk from "aws-cdk-lib";
import {
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_ssm as ssm,
  aws_iam as iam,
  aws_rds as rds,
  aws_lambda as lambda,
  aws_ecr_assets as ecrAssets,
  Tags,
  Aspects,
  CfnOutput,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create vpc
    // 名前は「スタック名/ID名」となる
    const vpc = new ec2.Vpc(this, "Vpc", {
      natGateways: 0,
      maxAzs: 2,
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
    });

    // add gateway endpoint to vpc
    // この方法だとなぜか名前がつかない
    const gatewayEndpoint = vpc.addGatewayEndpoint("GatewayEndpoint", {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });
    // gateway endpointにs3に対するアクセス許可を与える
    gatewayEndpoint.addToPolicy(
      new iam.PolicyStatement({
        principals: [new iam.AnyPrincipal()],
        actions: ["s3:*"],
        resources: ["*"],
      })
    );

    // create public subents
    // 名前は「スタック名/VPC名/PublicSubnet*」になる
    const publicSubnets = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC,
    });

    // create private subnets
    // 名前は「スタック名/VPC名/IsolatedSubnet*」になる
    const isolatedSubnets = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    });

    // create security group for BastionHost
    // 名前はタグでつける必要がある
    const ec2Sg = new ec2.SecurityGroup(this, "Ec2Sg", {
      vpc: vpc,
      securityGroupName: `${id}/BastionHostSg`,
    });
    Tags.of(ec2Sg).add("Name", `${id}/BastionHostSg`);

    // create ec2 for BationHost
    // 名前はinstanceNameで指定する
    const bastionHostEc2 = new ec2.BastionHostLinux(this, "BastionHostEc2", {
      vpc: vpc,
      instanceName: `${id}/BastionHostEc2`,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      subnetSelection: publicSubnets,
      securityGroup: ec2Sg,
    });

    // create parameter store
    // 名前はparameterNameで指定した文字列
    const paramStore = new ssm.StringParameter(this, "InstanceIdParameter", {
      parameterName: `/${id}/BastionHostEc2InstanceId`,
      stringValue: bastionHostEc2.instanceId,
      tier: ssm.ParameterTier.STANDARD,
    });

    /* ========================================================================
     * VPC Lambda (docker image function)
     */

    // create security group for VPC Lambda
    // RDSからのアクセス許可に必要
    // 名前はタグでつける必要がある
    const lambdaSg = new ec2.SecurityGroup(this, "LambdaSg", {
      vpc: vpc,
      securityGroupName: `${id}/LambdaSg`,
    });
    Tags.of(lambdaSg).add("Name", `${id}/LambdaSg`);

    // create Docker Image Function (Lambda)
    // TODO 命名規則調査
    const dockerLambda = new lambda.DockerImageFunction(this, "DockerIambda", {
      functionName: `${id}/DockerLambda`,
      code: lambda.DockerImageCode.fromImageAsset("../../app", {
        platform: ecrAssets.Platform.LINUX_AMD64,
      }),
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      vpc: vpc,
      securityGroups: [lambdaSg],
    });

    // Amazon API Gateway HTTP APIの定義
    // TODO 命名規則調査
    const api = new HttpApi(this, "Api", {
      apiName: `${id}/Api`,
      defaultIntegration: new HttpLambdaIntegration(
        "Integration",
        dockerLambda
      ),
    });

    // コンソールへデプロイ結果の表示
    new CfnOutput(this, "ApiEndpoint", {
      value: api.apiEndpoint,
    });

    /* ========================================================================
     * RDS (Aurora Serverless v2 postgres)
     */

    // create s3 bucket
    // RDSに対してS3からImportとS3へExportに利用するためのバケット
    // 名前は「スタック名（lower case）-bucket******」
    const bucket = new s3.Bucket(this, "Bucket", {
      versioned: true,
      // bucket is not destroyed when stack is removed
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: false,
      // バケットが空じゃなくても自動削除する
      autoDeleteObjects: true,
    });

    // create security group for RDS
    // 名前はタグでつける必要がある
    const rdsSg = new ec2.SecurityGroup(this, "RdsSecurityGroup", {
      vpc: vpc,
      securityGroupName: `${id}/RdsSecurityGroup`,
    });
    Tags.of(rdsSg).add("Name", `${id}/RdsSecurityGroup`);
    // RDS SGにEC2 SGからの5432ポートの接続を許可する設定を追加
    rdsSg.addIngressRule(ec2Sg, ec2.Port.tcp(5432), "from bastion host ec2 sg");
    // RDS SGにVPC Lambdaからの5432ポートの接続を許可する設定を追加
    rdsSg.addIngressRule(lambdaSg, ec2.Port.tcp(5432), "from vpc lambda sg");

    // create a db cluster (postgres aurora serevrless v2)
    // TODO 命名規則の調査
    const dbCluster = new rds.DatabaseCluster(this, "DbCluster", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_14_6,
      }),
      instances: 1,
      credentials: rds.Credentials.fromGeneratedSecret("adminuser"),
      instanceProps: {
        vpc: vpc,
        instanceType: new ec2.InstanceType("serverless"),
        vpcSubnets: isolatedSubnets,
        publiclyAccessible: false,
        securityGroups: [rdsSg],
      },
      s3ExportBuckets: [bucket],
      s3ImportBuckets: [bucket],
    });

    // add capacity to the db cluster to enable scaling
    Aspects.of(dbCluster).add({
      visit(node) {
        if (node instanceof rds.CfnDBCluster) {
          node.serverlessV2ScalingConfiguration = {
            minCapacity: 0.5, // min capacity is 0.5 vCPU
            maxCapacity: 1, // max capacity is 1 vCPU (default)
          };
        }
      },
    });
  }
}

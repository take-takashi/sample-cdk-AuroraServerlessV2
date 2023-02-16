import * as cdk from "aws-cdk-lib";
import { aws_ec2 as ec2, Tags } from "aws-cdk-lib";
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
      subnetSelection: isolatedSubnets,
      securityGroup: ec2Sg,
    });
  }
}

import * as cdk from "aws-cdk-lib";
import { aws_ec2 as ec2 } from "aws-cdk-lib";
import { Construct } from "constructs";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create vpc
    const vpc = new ec2.Vpc(this, "Vpc", {
      natGateways: 0,
      maxAzs: 2,
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
    });

    // create private subnets
    const privateSubnets = vpc.selectSubnets({
      subnetGroupName: "private-subnet",
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    });

    // create security group for BastionHost
    const ec2Sg = new ec2.SecurityGroup(this, "Ec2Sg", {
      vpc: vpc,
      securityGroupName: "BastionHostSg",
    });

    // create ec2 for BationHost
    const bastionHostEc2 = new ec2.BastionHostLinux(this, "BastionHostEc2", {
      vpc: vpc,
      instanceName: "BastionHostEc2ForRDS",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      subnetSelection: privateSubnets,
      securityGroup: ec2Sg,
    });
  }
}

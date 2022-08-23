import * as blueprints from '@aws-quickstart/eks-blueprints';
import { ISecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, IDatabaseInstance } from 'aws-cdk-lib/aws-rds';

export class LookupRdsInstanceProvider implements blueprints.ResourceProvider<IDatabaseInstance> {
  readonly instanceIdentifier: string;
  readonly instanceEndpointAddress: string;
  readonly port: number;
  readonly securityGroups: ISecurityGroup[];

  constructor(
    instanceIdentifier: string,
    instanceEndpointAddress: string,
    port: number,
    securityGroups: ISecurityGroup[],
    private id?: string
  ) {
    this.instanceIdentifier = instanceIdentifier;
    this.instanceEndpointAddress = instanceEndpointAddress;
    this.port = port;
    this.securityGroups = securityGroups;
  }

  provide(context: blueprints.ResourceContext): IDatabaseInstance {
    return DatabaseInstance.fromDatabaseInstanceAttributes(
      context.scope,
      this.id ?? `${this.instanceIdentifier}-lookup`,
      {
        instanceIdentifier: this.instanceIdentifier,
        instanceEndpointAddress: this.instanceEndpointAddress,
        port: this.port,
        securityGroups: this.securityGroups,
      }
    );
  }
}

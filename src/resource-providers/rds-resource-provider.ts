import * as blueprints from '@aws-quickstart/eks-blueprints';
import { DatabaseInstance, DatabaseInstanceProps, IDatabaseInstance } from 'aws-cdk-lib/aws-rds';

export class CreateRdsInstanceProvider implements blueprints.ResourceProvider<IDatabaseInstance> {
  constructor(private id: string, readonly options: DatabaseInstanceProps) {
    this.options = options;
  }

  provide(context: blueprints.ResourceContext): IDatabaseInstance {
    return new DatabaseInstance(context.scope, this.id, this.options);
  }
}

export class DirectRdsinstanceProvider implements blueprints.ResourceProvider<IDatabaseInstance> {
  constructor(readonly databaseInstance: IDatabaseInstance) {}

  provide(_context: blueprints.ResourceContext): IDatabaseInstance {
    return this.databaseInstance;
  }
}

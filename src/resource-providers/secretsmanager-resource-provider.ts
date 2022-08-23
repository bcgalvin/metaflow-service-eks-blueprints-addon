import * as blueprints from '@aws-quickstart/eks-blueprints';
import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class LookupSecretNameProvider implements blueprints.ResourceProvider<ISecret> {
  readonly secretName: string;

  constructor(secretName: string, private id?: string) {
    this.secretName = secretName;
  }

  provide(context: blueprints.ResourceContext): ISecret {
    return Secret.fromSecretNameV2(context.scope, this.id ?? `${this.secretName}-lookup`, this.secretName);
  }
}

export class LookupSecretArnProvider implements blueprints.ResourceProvider<ISecret> {
  readonly secretArn: string;

  constructor(secretArn: string, private id?: string) {
    this.secretArn = secretArn;
  }

  provide(context: blueprints.ResourceContext): ISecret {
    return Secret.fromSecretCompleteArn(context.scope, this.id ?? `${this.secretArn}-lookup`, this.secretArn);
  }
}

export class DirectSecretProvider implements blueprints.ResourceProvider<ISecret> {
  constructor(readonly secret: ISecret) {}

  provide(_context: blueprints.ResourceContext): ISecret {
    return this.secret;
  }
}

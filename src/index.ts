import * as blueprints from '@aws-quickstart/eks-blueprints';
import { Cluster, ServiceAccount } from 'aws-cdk-lib/aws-eks';
import { Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IDatabaseInstance } from 'aws-cdk-lib/aws-rds';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import merge from 'ts-deepmerge';
import { ValuesSchema } from './values';

export * from './resource-providers';

export interface MetaflowServiceAddOnProps extends blueprints.HelmAddOnUserProps, ValuesSchema {}

export const defaultProps: blueprints.HelmAddOnProps = {
  name: 'metaflow-service',
  namespace: 'metaflow',
  chart: 'metaflow-service',
  version: '0.2.0',
  release: 'blueprints-addon-metaflow-service',
  repository: 'https://bcgalvin.github.io/metaflow-helm/',
};

export class MetaflowServiceAddOn extends blueprints.HelmAddOn {
  readonly options: MetaflowServiceAddOnProps;

  constructor(props?: MetaflowServiceAddOnProps) {
    super({ ...defaultProps, ...props });
    this.options = { ...defaultProps, ...props };
  }

  deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct> {
    const cluster = clusterInfo.cluster;
    const metadataDatabaseInstance: IDatabaseInstance = clusterInfo.getRequiredResource('artifactRepositoryS3Bucket');
    const artifactRepositoryS3Bucket: IBucket = clusterInfo.getRequiredResource('artifactRepositoryS3Bucket');
    const namespace = this.options.namespace!;
    const release = this.options.release!;

    const ns = blueprints.utils.createNamespace(namespace, cluster, true, true);
    const sa = this.createServiceAccountWithIRSA(cluster, namespace, release, artifactRepositoryS3Bucket);
    sa.node.addDependency(ns);

    let values: ValuesSchema = {
      image: {
        tag: '2.3.0',
      },
      serviceAccount: {
        create: false,
        name: sa.serviceAccountName,
      },
      metadatadb: {
        host: metadataDatabaseInstance.dbInstanceEndpointAddress,
        user: 'metaflow',
        name: 'metaflow',
      },
    };
    values = merge(values, this.props.values ?? {});

    const chart = this.addHelmChart(clusterInfo, values, false);
    chart.node.addDependency(ns);
    return Promise.resolve(chart);
  }

  protected createServiceAccountWithIRSA(
    cluster: Cluster,
    namespace: string,
    release: string,
    s3Bucket: IBucket
  ): ServiceAccount {
    const metaflowServicePolicyDocument = new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: [
            'ecr:GetAuthorizationToken',
            'ecr:BatchCheckLayerAvailability',
            'ecr:GetDownloadUrlForLayer',
            'ecr:BatchGetImage',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
          effect: Effect.ALLOW,
          resources: ['*'],
        }),
      ],
    });

    const sa = blueprints.utils.createServiceAccount(cluster, release, namespace, metaflowServicePolicyDocument);
    s3Bucket.grantReadWrite(sa);

    return sa;
  }
}

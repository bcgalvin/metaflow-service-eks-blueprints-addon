import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { KubernetesVersion } from 'aws-cdk-lib/aws-eks';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { DirectS3BucketProvider } from '../../../src';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';

export class MetaflowServiceEksBlueprintAddonStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    blueprints.HelmAddOn.validateHelmVersions = true;
    const kubeVersion = KubernetesVersion.V1_21; // CDK eks doesn't support > 1.21 currently

    const account = props?.env?.account!;
    const region = props?.env?.region!;

    const s3Bucket = new Bucket(this, 'artifacts-bucket', {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    blueprints.EksBlueprint.builder()
      .name('argo-wf-cluster')
      .account(account)
      .region(region)
      .version(kubeVersion)
      .resourceProvider('artifactRepositoryS3Bucket', new DirectS3BucketProvider(s3Bucket))
      .addOns(
        // EkS Addons
        new blueprints.VpcCniAddOn(),
        new blueprints.CoreDnsAddOn(),
        new blueprints.KubeProxyAddOn(),
        new blueprints.EbsCsiDriverAddOn(),
        // Helm Addons
        new blueprints.MetricsServerAddOn(),
        new blueprints.SecretsStoreAddOn(),
        new blueprints.KubeviousAddOn(),
        // Cluster Addons
        new blueprints.SSMAgentAddOn(),
        new blueprints.ClusterAutoScalerAddOn(),
        new blueprints.XrayAddOn()
      )
      .enableControlPlaneLogTypes(blueprints.ControlPlaneLogType.API)
      .build(scope, `${id}-cluster`, {
        env: {
          account: account,
          region: region,
        },
      });
  }
}

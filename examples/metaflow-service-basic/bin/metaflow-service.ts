#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MetaflowServiceEksBlueprintAddonStack } from '../lib/metaflow-service-eks-blueprint-addon-stack';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();
new MetaflowServiceEksBlueprintAddonStack(app, 'argo-workflows-stack', {
  env: env,
});

app.synth();

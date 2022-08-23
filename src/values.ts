export interface ValuesSchema {
  replicaCount?: number;
  image?: Image;
  imagePullSecrets?: any[];
  nameOverride?: string;
  fullnameOverride?: string;
  serviceAccount?: ServiceAccount;
  podAnnotations?: Affinity;
  podSecurityContext?: Affinity;
  dbMigrations?: DBMigrations;
  securityContext?: Affinity;
  service?: Service;
  ingress?: Ingress;
  resources?: Affinity;
  autoscaling?: Autoscaling;
  nodeSelector?: Affinity;
  tolerations?: any[];
  affinity?: Affinity;
  envFrom?: any[];
  metadatadb?: Metadatadb;
}

export interface Affinity {}

export interface Autoscaling {
  enabled?: boolean;
  minReplicas?: number;
  maxReplicas?: number;
  targetCPUUtilizationPercentage?: number;
}

export interface DBMigrations {
  runOnStart?: boolean;
  onlyIfDbEmpty?: boolean;
}

export interface Image {
  repository?: string;
  pullPolicy?: string;
  tag?: string;
}

export interface Ingress {
  enabled?: boolean;
  className?: string;
  annotations?: Affinity;
  hosts?: Host[];
  tls?: any[];
}

export interface Host {
  host?: string;
  paths?: Path[];
}

export interface Path {
  path?: string;
  pathType?: string;
}

export interface Metadatadb {
  port?: number;
  password?: string;
  host?: string;
  user?: string;
  name?: string;
}

export interface Service {
  type?: string;
  port?: number;
  annotations?: Affinity;
}

export interface ServiceAccount {
  create?: boolean;
  annotations?: Affinity;
  name?: string;
}

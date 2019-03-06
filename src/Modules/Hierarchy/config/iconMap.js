import React from 'react';
import {
  HierarchyIcon,
  OrganizationIcon,
  WorkspaceIcon,
  MetamodelIcon,
  ProviderIcon,
  UserIcon,
  GroupIcon,
  EnvironmentIcon,
  LambdaIcon,
  ContainerIcon,
  APIIcon,
  PolicyIcon,
  SecretIcon,
  StreamIcon,
  DataFeedIcon,
  VolumeIcon,
  MainframeIcon,
  AppDeploymentIcon,
} from 'components/Icons';

const defaultSize = 22;

const iconMappings = (size, options) => ({
  hierarchy: <HierarchyIcon size={size} color="action" {...options} />,
  organization: <OrganizationIcon size={size} color="action" {...options} />,
  workspace: <WorkspaceIcon size={size} color="action" {...options} />,
  provider: <ProviderIcon size={size} color="action" {...options} />,
  user: <UserIcon size={size} color="action" {...options} />,
  group: <GroupIcon size={size} color="action" {...options} />,
  resourceType: <MetamodelIcon size={size} color="action" {...options} />,
  environment: <EnvironmentIcon size={size} color="action" {...options} />,
  container: <ContainerIcon size={size} color="action" {...options} />,
  lambda: <LambdaIcon size={size} color="action" {...options} />,
  api: <APIIcon size={size} color="action" {...options} />,
  policy: <PolicyIcon size={size} color="action" {...options} />,
  volume: <VolumeIcon size={size} color="action" {...options} />,
  secret: <SecretIcon size={size} color="action" {...options} />,
  stream: <StreamIcon size={size} color="action" {...options} />,
  datafeed: <DataFeedIcon size={size} color="action" {...options} />,
  appDeployment: <AppDeploymentIcon size={size} color="action" {...options} />,
  cloudframe: <MainframeIcon size={size} color="action" {...options} />,
});

export default (icon, size = defaultSize, options = {}) => iconMappings(size, options)[icon];

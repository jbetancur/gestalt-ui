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
} from 'components/Icons';

const defaultSize = 22;

const iconMappings = (size, options) => ({
  hierarchy: <HierarchyIcon size={size} {...options} />,
  organization: <OrganizationIcon size={size} {...options} />,
  workspace: <WorkspaceIcon size={size} {...options} />,
  provider: <ProviderIcon size={size} {...options} />,
  user: <UserIcon size={size} {...options} />,
  group: <GroupIcon size={size} {...options} />,
  resourceType: <MetamodelIcon size={size} {...options} />,
  environment: <EnvironmentIcon size={size} {...options} />,
  container: <ContainerIcon size={size} {...options} />,
  lambda: <LambdaIcon size={size} {...options} />,
  api: <APIIcon size={size} {...options} />,
  policy: <PolicyIcon size={size} {...options} />,
  volume: <VolumeIcon size={size} {...options} />,
  secret: <SecretIcon size={size} {...options} />,
  stream: <StreamIcon size={size} {...options} />,
  datafeed: <DataFeedIcon size={size} {...options} />,
  cloudframe: <MainframeIcon size={size} {...options} />,
});

export default (icon, size = defaultSize, options = {}) => iconMappings(size, options)[icon];

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

const iconMappings = size => ({
  hierarchy: <HierarchyIcon size={size} />,
  organization: <OrganizationIcon size={size} />,
  workspace: <WorkspaceIcon size={size} />,
  provider: <ProviderIcon size={size} />,
  user: <UserIcon size={size} />,
  group: <GroupIcon size={size} />,
  resourceType: <MetamodelIcon size={size} />,
  environment: <EnvironmentIcon size={size} />,
  container: <ContainerIcon size={size} />,
  lambda: <LambdaIcon size={size} />,
  api: <APIIcon size={size} />,
  policy: <PolicyIcon size={size} />,
  volume: <VolumeIcon size={size} />,
  secret: <SecretIcon size={size} />,
  stream: <StreamIcon size={size} />,
  datafeed: <DataFeedIcon size={size} />,
  cloudframe: <MainframeIcon size={size} />,
});

export default (icon, size = defaultSize) => iconMappings(size)[icon];

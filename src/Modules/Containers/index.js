import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ContainerCreate from './containers/ContainerCreateContainer';
import ContainerEdit from './containers/ContainerEditContainer';

const ContainerRoot = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/containers/create" component={ContainerCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/containers/:containerId/edit" component={ContainerEdit} />
  </Switch>
);

export default ContainerRoot;
export { default as Containers } from './containers/ContainerListingContainer';
export { default as ContainerCreate } from './containers/ContainerCreateContainer';
export { default as ContainerEdit } from './containers/ContainerEditContainer';
export { default as ContainerInstances } from './components/ContainerInstances';
export { default as ContainerServiceAddresses } from './components/ContainerServiceAddresses';
export { default as ContainerActions } from './components/ContainerActions';
export { default as ContainerActionsModal } from './ActionModals';
export { default as containerActionCreators } from './actions';
export { default as payloadTransformer } from './payloadTransformer';

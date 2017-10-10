import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Providers from './containers/ProviderListingContainer';
import ProviderCreate from './containers/ProviderCreateContainer';
import ProviderEdit from './containers/ProviderEditContainer';

const ProviderRoot = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/providers" component={Providers} />
    <Route exact path="/:fqon/hierarchy/providers/create" component={ProviderCreate} />
    <Route exact path="/:fqon/hierarchy/providers/:providerId/edit" component={ProviderEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers" component={Providers} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers/create" component={ProviderCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers/:providerId/edit" component={ProviderEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/providers/create" component={ProviderCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/providers/:providerId/edit" component={ProviderEdit} />
  </Switch>
);

export default ProviderRoot;
export { default as Providers } from './containers/ProviderListingContainer';
export { default as ProviderEdit } from './containers/ProviderCreateContainer';
export { default as ProviderCreate } from './containers/ProviderCreateContainer';
export { default as payloadTransformer } from './payloadTransformer';

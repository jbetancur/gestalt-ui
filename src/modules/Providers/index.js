import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Providers from './containers/ProviderListing';
import ProviderCreate from './containers/ProviderCreate';
import ProviderEdit from './containers/ProviderEdit';

const ProviderRoot = () => (
  <div>
    <Switch>
      <Route exact path={'/:fqon/hierarchy/providers'} component={Providers} />
      <Route exact path={'/:fqon/hierarchy/providers/create'} component={ProviderCreate} />
      <Route exact path={'/:fqon/hierarchy/providers/:providerId/edit'} component={ProviderEdit} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/providers'} component={Providers} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/providers/create'} component={ProviderCreate} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/providers/:providerId/edit'} component={ProviderEdit} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/providers/create'} component={ProviderCreate} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/providers/:providerId/edit'} component={ProviderEdit} />
    </Switch>
  </div>
);

export default ProviderRoot;
export { default as Providers } from './containers/ProviderListing';
export { default as ProviderEdit } from './containers/ProviderCreate';
export { default as ProviderCreate } from './containers/ProviderCreate';
export { default as payloadTransformer } from './payloadTransformer';

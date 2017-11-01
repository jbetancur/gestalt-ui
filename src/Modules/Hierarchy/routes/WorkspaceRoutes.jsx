import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import { Providers, ProviderCreate, ProviderEdit } from 'Modules/Providers';
import Environments from '../components/EnvironmentListing';

const WorkspaceRoutes = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/:workspaceId" />
    <Route path="/:fqon/hierarchy/:workspaceId/environments" component={Environments} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers" component={Providers} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers/:providerId" component={ProviderEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/createProvider" component={ProviderCreate} />
    <Route component={NotFound} />
  </Switch>
);

export default WorkspaceRoutes;

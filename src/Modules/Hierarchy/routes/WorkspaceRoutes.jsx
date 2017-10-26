import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import { Providers, ProviderCreate, ProviderEdit } from 'Modules/Providers';
import Environments from '../containers/EnvironmentListingContainer';
import EnvironmentCreate from '../containers/EnvironmentCreateContainer';
import WorkspaceEdit from '../containers/WorkspaceEditContainer';

const WorkspaceRoutes = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/:workspaceId/edit" component={WorkspaceEdit} />
    <Route path="/:fqon/hierarchy/:workspaceId/environments" component={Environments} />s
    <Route exact path="/:fqon/hierarchy/:workspaceId/createEnvironment" component={EnvironmentCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers" component={Providers} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers/:providerId" component={ProviderEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/createProvider" component={ProviderCreate} />

    <Route component={NotFound} />
  </Switch>
);

export default WorkspaceRoutes;

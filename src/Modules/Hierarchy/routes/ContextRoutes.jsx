import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import HierarchyContext from '../components/HierarchyContext';
import WorkspaceContext from '../components/WorkspaceContext';
import EnvironmentContext from '../components/EnvironmentContext';

// Routing Structure. Order is important here
const ContextRoutes = () => (
  <Switch>
    <Route path="/:fqon/hierarchy/:workspaceId/environment/:environmentId" component={EnvironmentContext} />
    <Route path="/:fqon/hierarchy/:workspaceId" component={WorkspaceContext} />
    <Route path="/:fqon/hierarchy" component={HierarchyContext} />
    <Route path="/:fqon" component={HierarchyContext} />
    <Route component={NotFound} />
  </Switch>
);

export default ContextRoutes;

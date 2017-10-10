import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import ProviderRoot from 'Modules/Providers';
import LambdaRoot from 'Modules/Lambdas';
import APIRoot from 'Modules/APIs';
import PolicyRoot from 'Modules/Policies';
import ContainerRoot from 'Modules/Containers';
import UserRoot from 'Modules/Users';
import GroupRoot from 'Modules/Groups';
import SecretRoot from 'Modules/Secrets';
import HierarchyContext from './containers/HierarchyContextContainer';
import OrganizationCreate from './containers/OrganizationCreateContainer';
import OrganizationEdit from './containers/OrganizationEditContainer';
import WorkspaceCreate from './containers/WorkspaceCreateContainer';
import WorkspaceEdit from './containers/WorkspaceEditContainer';
import WorkspaceContext from './containers/WorkspaceContextContainer';
import EnvironmentCreate from './containers/EnvironmentCreateContainer';
import EnvironmentEdit from './containers/EnvironmentEditContainer';
import EnvironmentContext from './containers/EnvironmentContextContainer';

// Routing Structure
const HierarchyRoot = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy" component={HierarchyContext} />
    <Route path="/:fqon/hierarchy/providers" component={ProviderRoot} />
    <Route path="/:fqon/hierarchy/users" component={UserRoot} />
    <Route path="/:fqon/hierarchy/groups" component={GroupRoot} />
    <Route exact path="/:fqon/hierarchy/createOrganization" component={OrganizationCreate} />
    <Route exact path="/:fqon/hierarchy/editOrganization" component={OrganizationEdit} />
    <Route exact path="/:fqon/hierarchy/createWorkspace" component={WorkspaceCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId" component={WorkspaceContext} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/editWorkspace" component={WorkspaceEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/createEnvironment" component={EnvironmentCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId" component={EnvironmentContext} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/edit" component={EnvironmentEdit} />
    <Route path="/:fqon/hierarchy/:workspaceId/providers" component={ProviderRoot} />
    <Route path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/providers" component={ProviderRoot} />
    <Route path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/lambdas" component={LambdaRoot} />
    <Route path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/containers" component={ContainerRoot} />
    <Route path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis" component={APIRoot} />
    <Route path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies" component={PolicyRoot} />
    <Route path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/secrets" component={SecretRoot} />
    <Route component={NotFound} />
  </Switch>
);

export default HierarchyRoot;
export { default as HierarchyContext } from './containers/HierarchyContextContainer';
export { default as OrganizationCreate } from './containers/OrganizationCreateContainer';
export { default as OrganizationEdit } from './containers/OrganizationEditContainer';
export { default as WorkspaceCreate } from './containers/WorkspaceCreateContainer';
export { default as WorkspaceEdit } from './containers/WorkspaceEditContainer';
export { default as WorkspaceContext } from './containers/WorkspaceContextContainer';
export { default as EnvironmentCreate } from './containers/EnvironmentCreateContainer';
export { default as EnvironmentEdit } from './containers/EnvironmentEditContainer';
export { default as EnvironmentContext } from './containers/EnvironmentContextContainer';
export { default as EnvironmentListing } from './containers/EnvironmentListingContainer';
export { default as HierarchyNav } from './components/HierarchyNav';
export { default as WorkspaceNav } from './components/WorkspaceNav';
export { default as EnvironmentNav } from './components/EnvironmentNav';
export { default as hierarchyActions } from './actions';

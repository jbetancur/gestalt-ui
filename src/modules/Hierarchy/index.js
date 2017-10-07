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
import HierarchyContext from './containers/HierarchyContext';
import OrganizationCreate from './containers/OrganizationCreate';
import OrganizationEdit from './containers/OrganizationEdit';
import WorkspaceCreate from './containers/WorkspaceCreate';
import WorkspaceEdit from './containers/WorkspaceEdit';
import WorkspaceContext from './containers/WorkspaceContext';
import EnvironmentCreate from './containers/EnvironmentCreate';
import EnvironmentEdit from './containers/EnvironmentEdit';
import EnvironmentContext from './containers/EnvironmentContext';

// Routing Structure
const HierarchyRoot = () => (
  <Switch>
    <Route exact path={'/:fqon/hierarchy'} component={HierarchyContext} />
    <Route path={'/:fqon/hierarchy/providers'} component={ProviderRoot} />
    <Route path={'/:fqon/hierarchy/users'} component={UserRoot} />
    <Route path={'/:fqon/hierarchy/groups'} component={GroupRoot} />
    <Route exact path={'/:fqon/hierarchy/createOrganization'} component={OrganizationCreate} />
    <Route exact path={'/:fqon/hierarchy/editOrganization'} component={OrganizationEdit} />
    <Route exact path={'/:fqon/hierarchy/createWorkspace'} component={WorkspaceCreate} />
    <Route exact path={'/:fqon/hierarchy/:workspaceId'} component={WorkspaceContext} />
    <Route exact path={'/:fqon/hierarchy/:workspaceId/editWorkspace'} component={WorkspaceEdit} />
    <Route exact path={'/:fqon/hierarchy/:workspaceId/createEnvironment'} component={EnvironmentCreate} />
    <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId'} component={EnvironmentContext} />
    <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/edit'} component={EnvironmentEdit} />
    <Route path={'/:fqon/hierarchy/:workspaceId/providers'} component={ProviderRoot} />
    <Route path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/providers'} component={ProviderRoot} />
    <Route path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/lambdas'} component={LambdaRoot} />
    <Route path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/containers'} component={ContainerRoot} />
    <Route path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/apis'} component={APIRoot} />
    <Route path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies'} component={PolicyRoot} />
    <Route path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/secrets'} component={SecretRoot} />
    <Route component={NotFound} />
  </Switch>
);

export default HierarchyRoot;
export { default as HierarchyContext } from './containers/HierarchyContext';
export { default as OrganizationCreate } from './containers/OrganizationCreate';
export { default as OrganizationEdit } from './containers/OrganizationEdit';
export { default as WorkspaceCreate } from './containers/WorkspaceCreate';
export { default as WorkspaceEdit } from './containers/WorkspaceEdit';
export { default as WorkspaceContext } from './containers/WorkspaceContext';
export { default as EnvironmentCreate } from './containers/EnvironmentCreate';
export { default as EnvironmentEdit } from './containers/EnvironmentEdit';
export { default as EnvironmentContext } from './containers/EnvironmentContext';
export { default as EnvironmentListing } from './containers/EnvironmentListing';
export { default as HierarchyNav } from './components/HierarchyNav';
export { default as WorkspaceNav } from './components/WorkspaceNav';
export { default as EnvironmentNav } from './components/EnvironmentNav';
export { default as hierarchyActions } from './actions';

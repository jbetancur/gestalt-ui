import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import { Providers, ProviderCreate, ProviderEdit } from 'Modules/Providers';
import { Users, UserCreate, UserEdit } from 'Modules/Users';
import { Groups, GroupCreate, GroupEdit } from 'Modules/Groups';
import { ResourceTypeListing } from 'Modules/ResourceTypes';
// import { MicroModeler } from 'Modules/MicroModeler';
import HierarchyListing from '../containers/HierarchyListingContainer';
import OrganizationCreate from '../containers/OrganizationCreateContainer';
import OrganizationEdit from '../containers/OrganizationEditContainer';
import WorkspaceCreate from '../containers/WorkspaceCreateContainer';

const HierarchyRoutes = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy" component={HierarchyListing} />
    <Route exact path="/:fqon/createOrganization" component={OrganizationCreate} />
    <Route exact path="/:fqon/editOrganization" component={OrganizationEdit} />
    <Route exact path="/:fqon/createWorkspace" component={WorkspaceCreate} />

    <Route exact path="/:fqon/providers" component={Providers} />
    <Route exact path="/:fqon/providers/create" component={ProviderCreate} />
    <Route exact path="/:fqon/providers/:providerId/edit" component={ProviderEdit} />

    <Route exact path="/:fqon/users" component={Users} />
    <Route exact path="/:fqon/users/create" component={UserCreate} />
    <Route exact path="/:fqon/users/:userId/edit" component={UserEdit} />

    <Route exact path="/:fqon/groups" component={Groups} />
    <Route exact path="/:fqon/groups/create" component={GroupCreate} />
    <Route exact path="/:fqon/groups/:groupId/edit" component={GroupEdit} />

    {/* <Route exact path="/:fqon/micromodeler" component={MicroModeler} /> */}
    <Route exact path="/:fqon/resourcetypes" component={ResourceTypeListing} />

    <Route component={NotFound} />
  </Switch>
);

export default HierarchyRoutes;

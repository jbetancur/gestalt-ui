import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Providers, ProviderCreate, ProviderEdit } from 'Modules/Providers';
import { Users, UserCreate, UserEdit } from 'Modules/Users';
import { Groups, GroupCreate, GroupEdit } from 'Modules/Groups';
import { ResourceTypeListing, CreateResourceType, EditResourceType } from 'Modules/ResourceTypes';
// import { ServiceModeler, ServiceSpecListing } from 'Modules/ServiceModeler';
import HierarchyListing from '../containers/HierarchyListing';
import withModalRouter from './withModalRouter';
import NotFound from '../../../App/components/NotFound';

const HierarchyRoutes = ({ location, previousLocation, isModal }) => (
  <Switch location={isModal ? previousLocation : location}>
    <Route exact path="/:fqon" />
    <Route exact path="/:fqon/hierarchy" component={HierarchyListing} />

    <Route exact path="/:fqon/providers" component={Providers} />
    <Route exact path="/:fqon/providers/create" component={ProviderCreate} />
    <Route exact path="/:fqon/providers/:providerId" component={ProviderEdit} />

    <Route exact path="/:fqon/users" component={Users} />
    <Route exact path="/:fqon/users/create" component={UserCreate} />
    <Route exact path="/:fqon/users/:userId" component={UserEdit} />

    <Route exact path="/:fqon/groups" component={Groups} />
    <Route exact path="/:fqon/groups/create" component={GroupCreate} />
    <Route exact path="/:fqon/groups/:groupId" component={GroupEdit} />

    <Route exact path="/:fqon/resourcetypes/create" component={CreateResourceType} />
    <Route exact path="/:fqon/resourcetypes/:resourceTypeId" component={EditResourceType} />
    <Route exact path="/:fqon/resourcetypes" component={ResourceTypeListing} />

    {/* <Route exact path="/:fqon/servicespecs/create" component={ServiceModeler} />
    <Route exact path="/:fqon/servicespecs" component={ServiceSpecListing} /> */}

    <Route component={NotFound} />
  </Switch>
);

HierarchyRoutes.propTypes = {
  location: PropTypes.object.isRequired,
  previousLocation: PropTypes.object,
  isModal: PropTypes.bool.isRequired,
};

HierarchyRoutes.defaultProps = {
  previousLocation: {}
};

export default withModalRouter(HierarchyRoutes);

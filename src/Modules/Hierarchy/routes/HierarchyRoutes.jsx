import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import { Providers, ProviderCreate, ProviderEdit } from 'Modules/Providers';
import { Users, UserCreate, UserEdit } from 'Modules/Users';
import { Groups, GroupCreate, GroupEdit } from 'Modules/Groups';
import { ResourceTypeListing } from 'Modules/ResourceTypes';
// import { MicroModeler } from 'Modules/MicroModeler';';
import HierarchyListing from '../components/HierarchyListing';
import withModalRouter from './withModalRouter';

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

    {/* <Route exact path="/:fqon/micromodeler" component={MicroModeler} /> */}
    <Route exact path="/:fqon/resourcetypes" component={ResourceTypeListing} />

    <Route component={NotFound} />
  </Switch>
);

HierarchyRoutes.propTypes = {
  location: PropTypes.object.isRequired,
  previousLocation: PropTypes.object.isRequired,
  isModal: PropTypes.bool.isRequired,
};

export default withModalRouter(HierarchyRoutes);

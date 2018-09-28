import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Providers, ProviderCreate, ProviderEdit } from 'Modules/Providers';
import Environments from '../containers/EnvironmentListing';
import withModalRouter from './withModalRouter';
import NotFound from '../../../App/components/NotFound';

const WorkspaceRoutes = ({ location, previousLocation, isModal }) => (
  <Switch location={isModal ? previousLocation : location}>
    <Route exact path="/:fqon/hierarchy/:workspaceId" />
    <Route path="/:fqon/hierarchy/:workspaceId/environments" component={Environments} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers" component={Providers} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/providers/:providerId" component={ProviderEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/createProvider" component={ProviderCreate} />
    <Route component={NotFound} />
  </Switch>
);

WorkspaceRoutes.propTypes = {
  location: PropTypes.object.isRequired,
  previousLocation: PropTypes.object,
  isModal: PropTypes.bool.isRequired,
};

WorkspaceRoutes.defaultProps = {
  previousLocation: {}
};

export default withModalRouter(WorkspaceRoutes);

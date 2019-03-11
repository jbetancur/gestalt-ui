import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Switch, Route } from 'react-router-dom';
import NotFound from '../../../App/components/NotFound';
import HierarchyContext from '../contexts/HierarchyContext';
import WorkspaceContext from '../contexts/WorkspaceContext';
import EnvironmentContext from '../contexts/EnvironmentContext';
import OrganizationCreate from '../components/OrganizationCreate';
import OrganizationEdit from '../components/OrganizationEdit';
import WorkspaceCreate from '../components/WorkspaceCreate';
import EnvironmentCreate from '../components/EnvironmentCreate';
import EnvironmentEdit from '../components/EnvironmentEdit';
import WorkspaceEdit from '../components/WorkspaceEdit';
import withModalRouter from './withModalRouter';

// Routing Structure. Order is important here
const ContextRoutes = ({ location, previousLocation, isModal }) => (
  <React.Fragment>
    <Switch location={isModal ? previousLocation : location}>
      <Route path="/:fqon/hierarchy/:workspaceId/environment/:environmentId" component={EnvironmentContext} />
      <Route path="/:fqon/hierarchy/:workspaceId" component={WorkspaceContext} />
      <Route path="/:fqon/hierarchy" component={HierarchyContext} />
      <Route path="/:fqon" component={HierarchyContext} />
      <Route component={NotFound} />
    </Switch>

    {isModal ? <Route exact path="/:fqon/createOrganization" component={OrganizationCreate} /> : null}
    {isModal ? <Route exact path="/:fqon/editOrganization" component={OrganizationEdit} /> : null}
    {isModal ? <Route exact path="/:fqon/createWorkspace" component={WorkspaceCreate} /> : null}
    {isModal ? <Route exact path="/:fqon/hierarchy/:workspaceId/edit" component={WorkspaceEdit} /> : null}
    {isModal ? <Route exact path="/:fqon/hierarchy/:workspaceId/createEnvironment" component={EnvironmentCreate} /> : null}
    {isModal ? <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/edit" component={EnvironmentEdit} /> : null}
  </React.Fragment>
);

ContextRoutes.propTypes = {
  location: PropTypes.object.isRequired,
  previousLocation: PropTypes.object,
  isModal: PropTypes.bool.isRequired,
};

ContextRoutes.defaultProps = {
  previousLocation: {}
};

export default compose(
  withModalRouter,
)(ContextRoutes);

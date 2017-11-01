import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Switch, Route } from 'react-router-dom';
import { withContext } from 'Modules/ContextManagement';
import NotFound from 'components/NotFound';
import HierarchyContext from '../components/HierarchyContext';
import WorkspaceContext from '../components/WorkspaceContext';
import EnvironmentContext from '../components/EnvironmentContext';
import OrganizationCreate from '../components/OrganizationCreate';
import OrganizationEdit from '../components/OrganizationEdit';
import WorkspaceCreate from '../components/WorkspaceCreate';
import EnvironmentCreate from '../components/EnvironmentCreate';
import EnvironmentEdit from '../components/EnvironmentEdit';
import WorkspaceEdit from '../components/WorkspaceEdit';
import routingHelper from './routingHelper';

// Routing Structure. Order is important here
const ContextRoutes = (props) => {
  const { location, previousLocation, isModal } = props;

  return (
    <div>
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
    </div>
  );
};

ContextRoutes.propTypes = {
  location: PropTypes.object.isRequired,
  previousLocation: PropTypes.object.isRequired,
  isModal: PropTypes.bool.isRequired,
};

export default compose(
  routingHelper,
  withContext
)(ContextRoutes);

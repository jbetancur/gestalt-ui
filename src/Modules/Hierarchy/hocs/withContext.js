import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default () => (BaseComponent) => {
  class Context extends PureComponent {
    static displayName = 'Context (HOC)';

    static propTypes = {
      hierarchyContextActions: PropTypes.object.isRequired,
    };

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    hierarchyContext: {
      context: state.hierarchy.context,
      contextPending: state.hierarchy.context.pending,

      selectedOrganization: state.hierarchy.organization.organization,
      selectedOrganizationPending: state.hierarchy.organization.pending,

      selectedWorkspace: state.hierarchy.workspace.workspace,
      selectedWorkspacePending: state.hierarchy.workspace.pending,

      selectedEnvironment: state.hierarchy.environment.environment,
      selectedEnvironmentPending: state.hierarchy.environment.pending,

      allOrganizations: state.hierarchy.allOrganizations.organizations,
      allOrganizationsPending: state.hierarchy.allOrganizations.pending,
      allOrganizationsDropDown: state.hierarchy.allOrganizationsDropDown.organizations,
    }
  });

  const mapDispatchToProps = dispatch => ({
    hierarchyContextActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch'], 'Context'),

      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Org'),

      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Workspace'),

      createRequestAction(['fetch', 'update', 'delete'], 'Environment'),
      createRequestAction(['create'], 'Environment', { entityKey: 'workspaces' }),

      createRequestAction(['fetch'], 'AllOrgs'),
      createRequestAction(['fetch'], 'AllOrgsDropDown'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Context);
};

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withContext } from 'Modules/ContextManagement';
import { Providers } from 'Modules/Providers';
import Div from 'components/Div';
import WorkspaceNav from '../components/WorkspaceNav';
import WorkspaceHeader from '../components/WorkspaceHeader';
import Environments from './EnvironmentListingContainer';
import actions from '../actions';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    unloadActions: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    workspace: PropTypes.object.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchWorkspace, match, fetchContextActions } = this.props;
    fetchWorkspace(match.params.fqon, match.params.workspaceId);
    fetchContextActions(match.params.fqon, match.params.workspaceId, 'workspaces', { filter: ['workspace.list', 'workspace.detail'] });
  }

  componentWillUnmount() {
    const { unloadEnvironments } = this.props;

    unloadEnvironments();
  }

  renderThings(state) {
    switch (state) {
      case 'environments':
        return (
          <Environments {...this.props} />
        );
      case 'providers':
        return (
          <Providers {...this.props} />
        );
      default:
        return <div />;
    }
  }

  render() {
    const { navigation, handleNavigation, workspace } = this.props;

    return (
      <Div>
        <WorkspaceNav
          navigation={navigation}
          handleNavigation={handleNavigation}
        />
        <Div paddingLeft="5em">
          <WorkspaceHeader
            model={workspace}
            {...this.props}
          />
          {this.renderThings(navigation.view)}
        </Div>
      </Div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.hierarchy.workspaceContextNavigation,
  };
}

export default connect(mapStateToProps, actions)(withMetaResource(withContext(WorkspaceContext)));

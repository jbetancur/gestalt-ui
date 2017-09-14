import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'modules/MetaResource';
import { withContext } from 'modules/ContextManagement';
import { Providers } from 'modules/Providers';
import ListItemStacked from 'components/ListItemStacked';
import Div from 'components/Div';
import Navbar from 'components/Navbar';
import WorkspaceHeader from '../../components/WorkspaceHeader';
import Environments from '../../containers/EnvironmentListing';
import actions from '../../actions';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    // fetchContextActions: PropTypes.func.isRequired,
    unloadActions: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    workspace: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchWorkspace, match } = this.props;
    fetchWorkspace(match.params.fqon, match.params.workspaceId);
    // fetchContextActions(match.params.fqon, match.params.workspaceId, 'workspaces', { filter: ['workspace.list', 'workspace.detail'] });
  }

  renderNavItems() {
    const { navigation, handleNavigation } = this.props;

    return [
      <ListItemStacked
        key="workspace--environments"
        title="Environments"
        icon="folder"
        onClick={() => handleNavigation('workspace', 'environments', 0)}
        className={navigation.index === 0 && 'active-link'}
      />,
      <ListItemStacked
        key="workspace--providers"
        title="Providers"
        icon="settings_applications"
        onClick={() => handleNavigation('workspace', 'providers', 1)}
        className={navigation.index === 1 && 'active-link'}
      />,
    ];
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
    const { navigation, workspace } = this.props;

    return (
      <Div>
        <Navbar
          vertical
          items={this.renderNavItems()}
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

const bindActions = Object.assign({}, actions);

export default withMetaResource(connect(mapStateToProps, bindActions)(withContext(WorkspaceContext)));

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { appActions } from 'App';
import { withMetaResource } from 'modules/MetaResource';
import { withContext } from 'modules/ContextManagement';
import { Providers } from 'modules/Providers';
import ListItemStacked from 'components/ListItemStacked';
import Div from 'components/Div';
import Navbar from 'components/Navbar';
import { ProviderIcon } from 'components/Icons';
import WorkspaceHeader from '../../components/WorkspaceHeader';
import Environments from '../../containers/EnvironmentListing';
import actions from '../../actions';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    unloadActions: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchWorkspace, fetchContextActions, match } = this.props;
    fetchWorkspace(match.params.fqon, match.params.workspaceId);
    fetchContextActions(match.params.fqon, match.params.workspaceId, 'workspaces', { filter: ['workspace.list', 'workspace.detail'] });
  }

  handleViewState(view, index) {
    const { handleNavigation } = this.props;

    handleNavigation('workspace', view, index);
  }

  renderNavItems() {
    const { navigation } = this.props;

    return [
      <ListItemStacked
        title="Environments"
        icon="folder"
        onClick={() => this.handleViewState('environments', 0)}
        className={navigation.index === 0 && 'active-link'}
      />,
      <ListItemStacked
        title="Providers"
        icon={<ProviderIcon />}
        onClick={() => this.handleViewState('providers', 1)}
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
    const { navigation } = this.props;

    return (
      <Div>
        <WorkspaceHeader {...this.props} />
        <Div position="relative">
          <Navbar
            vertical
            items={this.renderNavItems()}
          />
          <Div style={{ paddingLeft: '4.2em' }}>
            {this.renderThings(navigation.view)}
          </Div>
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

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, appActions))(withContext(WorkspaceContext)));

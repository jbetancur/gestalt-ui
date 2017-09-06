import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { withContext } from 'modules/ContextManagement';
import { appActions } from 'App';
import { withMetaResource } from 'modules/MetaResource';
import { Providers } from 'modules/Providers';
import { Users } from 'modules/Users';
import { Groups } from 'modules/Groups';
import ListItemStacked from 'components/ListItemStacked';
import { ProviderIcon, HierarchyIcon } from 'components/Icons';
import Div from 'components/Div';
import Navbar from 'components/Navbar';
import HierarchyListing from '../HierarchyListing';
import HierarchyHeader from '../../components/HierarchyHeader';
import actions from '../../actions';

class HierarchyContext extends PureComponent {
  static propTypes = {
    organizationsSet: PropTypes.array,
    organizationSet: PropTypes.object.isRequired,
    workspacesSet: PropTypes.array,
    match: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    orangizationSetPending: PropTypes.bool.isRequired,
    onUnloadOrgSet: PropTypes.func.isRequired,
    unloadWorkspaces: PropTypes.func.isRequired,
    unloadWorkspaceContext: PropTypes.func.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    organizationsSet: [],
    workspacesSet: [],
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.fetchOrgSet(match.params.fqon);
    this.props.fetchContextActions(match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
    this.props.unloadWorkspaceContext();
    this.props.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.fetchOrgSet(nextProps.match.params.fqon);
      this.props.fetchContextActions(nextProps.match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
    }
  }

  componentWillUnmount() {
    /*
      explicitly unload orgs when component is unloaded - normally we do
      this via LOCATION_CHANGE within the reducer, but this presents an issue with side navigation
    */
    this.props.onUnloadOrgSet();
    this.props.unloadWorkspaces();
  }


  handleViewState(view, index) {
    const { handleNavigation } = this.props;

    handleNavigation('hierarchy', view, index);
  }

  renderNavItems() {
    const { match, t, navigation } = this.props;

    return [
      <ListItemStacked
        title={t('organizations.title')}
        icon={<HierarchyIcon />}
        onClick={() => this.handleViewState('hierarchy', 0)}
        className={navigation.index === 0 && 'active-link'}
      />,
      <ListItemStacked
        title={t('providers.title')}
        icon={<ProviderIcon />}
        onClick={() => this.handleViewState('providers', 1)}
        className={navigation.index === 1 && 'active-link'}
      />,
      <ListItemStacked
        title={t('users.title')}
        icon="person"
        onClick={() => this.handleViewState('users', 2)}
        className={navigation.index === 2 && 'active-link'}
        visible={match.params.fqon === 'root'}
      />,
      <ListItemStacked
        title={t('groups.title')}
        icon="group"
        onClick={() => this.handleViewState('groups', 3)}
        className={navigation.index === 3 && 'active-link'}
        visible={match.params.fqon === 'root'}
      />,
    ];
  }

  renderThings(state) {
    switch (state) {
      case 'hierarchy':
        return (
          <HierarchyListing {...this.props} />
        );
      case 'providers':
        return (
          <Providers {...this.props} />
        );
      case 'users':
        return (
          <Users {...this.props} />
        );
      case 'groups':
        return (
          <Groups {...this.props} />
        );
      default:
        return <div />;
    }
  }

  render() {
    const { organizationSet, navigation } = this.props;
    return (
      <Div>
        <Navbar
          vertical
          items={this.renderNavItems()}
        />
        <Div position="relative" style={{ paddingLeft: '4.2em' }}>
          <HierarchyHeader
            model={organizationSet}
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
    navigation: state.hierarchy.hierarchyContextNavigation,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, appActions))(translate()(withContext(HierarchyContext))));

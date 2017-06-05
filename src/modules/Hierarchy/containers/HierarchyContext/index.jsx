import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Sort from 'components/Sort';
import HierarchyDetail from '../../components/HierarchyDetail';
import OrganizationCard from '../../components/OrganizationCard';
import WorkspaceCard from '../../components/WorkspaceCard';
import * as actions from '../../actions';

class HierarchyContext extends PureComponent {
  static propTypes = {
    organizations: PropTypes.array,
    organization: PropTypes.object.isRequired,
    workspaces: PropTypes.array,
    params: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    fetchWorkspaces: PropTypes.func.isRequired,
    pendingOrgset: PropTypes.bool.isRequired,
    workspacesPending: PropTypes.bool.isRequired,
    onUnloadOrgSet: PropTypes.func.isRequired,
    unloadWorkspaces: PropTypes.func.isRequired,
    setCurrentOrgContext: PropTypes.func.isRequired,
    unloadWorkspaceContext: PropTypes.func.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
  };

  static defaultProps = {
    organizations: [],
    workspaces: [],
  };

  constructor(props) {
    super(props);

    this.state = { sortKey: 'description', order: 'asc' };
  }

  componentDidMount() {
    this.props.fetchOrgSet(this.props.params.fqon);
    this.props.fetchWorkspaces(this.props.params.fqon);
    this.props.unloadWorkspaceContext();
    this.props.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.fqon !== this.props.params.fqon) {
      this.props.fetchOrgSet(nextProps.params.fqon);
      this.props.fetchWorkspaces(nextProps.params.fqon);
    }

    // Keep the current Org Context Synced even on refresh
    if (nextProps.organization !== this.props.organization) {
      this.props.setCurrentOrgContext(nextProps.organization);
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

  renderCardsContainer() {
    const cardItems = this.props.organizations.concat(this.props.workspaces);
    const sortedOrgs = orderBy(cardItems, this.state.sortKey, this.state.order);
    const cardTypes = {
      'Gestalt::Resource::Organization': 'organization',
      'Gestalt::Resource::Workspace': 'workspace',
      'Gestalt::Resource::Environment': 'environment',
    };

    return (
      <div className="flex-row">
        <Sort
          visible={sortedOrgs.length}
          sortKey={this.state.sortKey}
          order={this.state.order}
          setKey={value => this.setState({ sortKey: value })}
          setOrder={value => this.setState({ order: value })}
        />
        {sortedOrgs.map(item => (
          cardTypes[item.resource_type] === 'organization' ?
            <OrganizationCard key={item.id} model={item} {...this.props} /> :
            <WorkspaceCard key={item.id} model={item} {...this.props} />
        ))}
      </div>
    );
  }

  render() {
    const { organization, pendingOrgset, workspacesPending } = this.props;

    return (
      <div>
        <HierarchyDetail model={organization} {...this.props} />
        {(pendingOrgset || workspacesPending) ? <LinearProgress id="heirarchy-progress" /> : this.renderCardsContainer()}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    // TODO: refactor as selector
    self: state.metaResource.self.self,
    pendingOrgset: state.metaResource.organizationSet.pending,
    organization: state.metaResource.organizationSet.organization,
    organizations: state.metaResource.organizationSet.organization.subOrganizations,
    workspaces: state.metaResource.workspaces.workspaces,
    pendingWorkspaces: state.metaResource.workspaces.pending,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(translate()(HierarchyContext));

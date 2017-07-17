import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { appActions } from 'App';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import Sort from 'components/Sort';
import HierarchyContextComponent from '../../components/HierarchyContext';
import OrganizationCard from '../../components/OrganizationCard';
import WorkspaceCard from '../../components/WorkspaceCard';
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
  };

  static defaultProps = {
    organizationsSet: [],
    workspacesSet: [],
  };

  constructor(props) {
    super(props);

    this.state = { sortKey: 'description', order: 'asc' };
  }

  componentDidMount() {
    this.props.fetchOrgSet(this.props.match.params.fqon);
    // this.props.fetchWorkspaces(this.props.match.params.fqon);
    this.props.unloadWorkspaceContext();
    this.props.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.fetchOrgSet(nextProps.match.params.fqon);
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
    const cardItems = this.props.organizationsSet.concat(this.props.workspacesSet);
    const sortedOrgs = orderBy(cardItems, this.state.sortKey, this.state.order);
    const cardTypes = {
      'Gestalt::Resource::Organization': 'organization',
      'Gestalt::Resource::Workspace': 'workspace',
      'Gestalt::Resource::Environment': 'environment',
    };

    return (
      <div className="flex-row">
        <Sort
          visible={sortedOrgs.length > 0}
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
    const { organizationSet, orangizationSetPending } = this.props;
    return (
      <div>
        <HierarchyContextComponent model={organizationSet} {...this.props} />
        {orangizationSetPending ? <ActivityContainer id="hierarchy-progress" /> : this.renderCardsContainer()}
      </div>
    );
  }
}


function mapStateToProps() {
  return {};
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, appActions))(translate()(withContext(HierarchyContext))));

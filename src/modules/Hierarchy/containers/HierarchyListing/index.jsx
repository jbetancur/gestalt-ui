import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import ActivityContainer from 'components/ActivityContainer';
import Sort from '../../components/Sort';
import OrganizationCard from '../../components/OrganizationCard';
import WorkspaceCard from '../../components/WorkspaceCard';

class HierarchyListing extends PureComponent {
  static propTypes = {
    organizationsSet: PropTypes.array,
    organizationSet: PropTypes.object.isRequired,
    workspacesSet: PropTypes.array,
    match: PropTypes.object.isRequired,
    orangizationSetPending: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    organizationsSet: [],
    workspacesSet: [],
  };

  constructor(props) {
    super(props);

    this.state = { sortKey: 'description', order: 'asc' };

    this.setSortKey = this.setSortKey.bind(this);
    this.setSortOrder = this.setSortOrder.bind(this);
  }

  setSortKey(sortKey) {
    this.setState({ sortKey });
  }

  setSortOrder(order) {
    this.setState({ order });
  }

  render() {
    const { orangizationSetPending, organizationsSet, workspacesSet } = this.props;
    const cardItems = organizationsSet.concat(workspacesSet);
    const sortedOrgs = orderBy(cardItems, this.state.sortKey, this.state.order);
    const cardTypes = {
      'Gestalt::Resource::Organization': 'organization',
      'Gestalt::Resource::Workspace': 'workspace',
      'Gestalt::Resource::Environment': 'environment',
    };

    return (
      orangizationSetPending ?
        <ActivityContainer id="hierarchy-progress" /> :
        <div className="flex-row">
          <Sort
            visible={sortedOrgs.length > 0}
            sortKey={this.state.sortKey}
            order={this.state.order}
            setKey={this.setSortKey}
            setOrder={this.setSortOrder}
          />
          {sortedOrgs.map(item => (
            cardTypes[item.resource_type] === 'organization' ?
              <OrganizationCard key={item.id} model={item} {...this.props} /> :
              <WorkspaceCard key={item.id} model={item} {...this.props} />
          ))}
        </div>
    );
  }
}


export default HierarchyListing;

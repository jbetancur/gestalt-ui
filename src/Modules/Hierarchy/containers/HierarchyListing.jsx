import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import Sort from '../components/Sort';
import OrganizationCard from './OrganizationCard';
import WorkspaceCard from './WorkspaceCard';
import ListingHeader from '../components/ListingHeader';
// import EnvironmentCard from './EnvironmentCard';

class HierarchyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    organizationsSet: PropTypes.array,
    organizationSet: PropTypes.object.isRequired,
    workspacesSet: PropTypes.array,
    fetchOrgSet: PropTypes.func.isRequired,
    organizationSetPending: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    organizationsSet: [],
    workspacesSet: [],
  };

  state = {
    sortKey: 'description',
    order: 'asc',
  };

  componentDidMount() {
    const { match, fetchOrgSet } = this.props;

    fetchOrgSet(match.params.fqon);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.fqon && prevProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.fetchOrgSet(this.props.match.params.fqon);
    }
  }

  setSortKey = (sortKey) => {
    this.setState({ sortKey });
  }

  setSortOrder = (order) => {
    this.setState({ order });
  }

  renderCard(item) {
    const cardTypes = {
      'Gestalt::Resource::Organization': 'organization',
      'Gestalt::Resource::Workspace': 'workspace',
      'Gestalt::Resource::Environment': 'environment',
    };

    switch (cardTypes[item.resource_type]) {
      case 'organization':
        return <OrganizationCard model={item} {...this.props} />;
      case 'workspace':
        return <WorkspaceCard model={item} {...this.props} />;
      // case 'environment':
      //   return <EnvironmentCard model={item} {...this.props} />;
      default:
        return <OrganizationCard model={item} {...this.props} />;
    }
  }

  render() {
    const { organizationSetPending, organizationsSet, workspacesSet } = this.props;
    // only show environments that have a workspace parent
    const cardItems = organizationsSet.concat(workspacesSet);
    const sortedOrgs = orderBy(cardItems, this.state.sortKey, this.state.order);

    return (
      organizationSetPending ? <ActivityContainer id="hierarchy-listing--loading" /> :
      <React.Fragment>
        <ListingHeader
          leftItems={
            <Sort
              disabled={!sortedOrgs.length}
              sortKey={this.state.sortKey}
              order={this.state.order}
              setKey={this.setSortKey}
              setOrder={this.setSortOrder}
            />
          }
        />
        <Row gutter={5} minColWidths={310}>
          {sortedOrgs.map(item => (
            <Col key={item.id} flex={2} xs={12}>
              {this.renderCard(item)}
            </Col>
          ))
          }
        </Row>
      </React.Fragment>
    );
  }
}

export default compose(
  withMetaResource
)(HierarchyListing);

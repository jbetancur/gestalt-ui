import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withOrganization } from 'Modules/MetaResource';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import { NoData } from 'components/TableCells';
import { OrganizationIcon, WorkspaceIcon } from 'components/Icons';
import Sort from '../components/Sort';
import OrganizationCard from './OrganizationCard';
import WorkspaceCard from './WorkspaceCard';
import ListingHeader from '../components/ListingHeader';
// import EnvironmentCard from './EnvironmentCard';

class HierarchyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    organizationActions: PropTypes.object.isRequired,
    organizationSet: PropTypes.object.isRequired,
    organizationSetPending: PropTypes.bool.isRequired,
  };

  state = {
    sortKey: 'description',
    order: 'asc',
  };

  componentDidMount() {
    const { match, organizationActions } = this.props;

    organizationActions.fetchOrgSet({ fqon: match.params.fqon });
  }

  componentDidUpdate(prevProps) {
    const { match, organizationActions } = this.props;

    if (match.params.fqon && prevProps.match.params.fqon !== match.params.fqon) {
      organizationActions.fetchOrgSet({ fqon: match.params.fqon });
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
    const { organizationSetPending, organizationSet } = this.props;
    const { organizations, workspaces } = organizationSet;
    // only show environments that have a workspace parent
    const cardItems = organizations.concat(workspaces);
    const sortedOrgs = orderBy(cardItems, this.state.sortKey, this.state.order);

    return (
      organizationSetPending
        ?
          <ActivityContainer id="hierarchy-listing--loading" />
        :
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
              ))}
            </Row>

            {!organizationSetPending && !cardItems.length &&
            <Row center fill paddingTop="180px">
              <NoData
                message="There are no Organizations or Workspaces to display"
                icon={(
                  <React.Fragment>
                    <OrganizationIcon size={150} />
                    <WorkspaceIcon size={150} />
                  </React.Fragment>
                )}
                createPath={{ pathname: `/${organizationSet.properties.fqon}/createOrganization`, state: { modal: true } }}
                createLabel="Create an Organization"
                showSecondaryCreate
                secondaryCreateLabel="Create a Workspace"
                secondaryCreatePath={{ pathname: `/${organizationSet.properties.fqon}/createWorkspace`, state: { modal: true } }}
              />
            </Row>}
          </React.Fragment>
    );
  }
}

export default compose(
  withOrganization()
)(HierarchyListing);

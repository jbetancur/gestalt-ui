import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import { NoData } from 'components/TableCells';
import { OrganizationIcon, WorkspaceIcon } from 'components/Icons';
import Sort from '../components/Sort';
import OrganizationCard from './OrganizationCard';
import WorkspaceCard from './WorkspaceCard';
import ListingHeader from '../components/ListingHeader';
import withContext from '../hocs/withContext';
// import EnvironmentCard from './EnvironmentCard';

class HierarchyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    contextPending: PropTypes.bool.isRequired,
  };

  state = {
    sortKey: 'description',
    order: 'asc',
  };

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
    const { contextPending, context } = this.props;
    const { organization, organizations, workspaces } = context;
    // only show environments that have a workspace parent
    const cardItems = organizations.concat(workspaces);
    const sortedOrgs = orderBy(cardItems, this.state.sortKey, this.state.order);

    return (
      contextPending
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
                <Col key={item.id} flex={2} xs={12} sm={6} md={4}>
                  {this.renderCard(item)}
                </Col>
              ))}
            </Row>

            {!contextPending && !cardItems.length &&
            <Row center fill paddingTop="180px">
              <NoData
                message="There are no Organizations or Workspaces to display"
                icon={(
                  <React.Fragment>
                    <OrganizationIcon size={150} />
                    <WorkspaceIcon size={150} />
                  </React.Fragment>
                )}
                createPath={{ pathname: `/${organization.properties.fqon}/createOrganization`, state: { modal: true } }}
                createLabel="Create an Organization"
                showSecondaryCreate
                secondaryCreateLabel="Create a Workspace"
                secondaryCreatePath={{ pathname: `/${organization.properties.fqon}/createWorkspace`, state: { modal: true } }}
              />
            </Row>}
          </React.Fragment>
    );
  }
}

export default compose(
  withContext(),
)(HierarchyListing);

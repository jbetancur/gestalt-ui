import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import memoize from 'memoize-one';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import { NoData } from 'components/TableCells';
import { OrganizationIcon, WorkspaceIcon } from 'components/Icons';
import { Title } from 'components/Typography';
import Divider from 'components/Divider';
import Sort from './Sort';
import OrganizationCard from './OrganizationCard';
import WorkspaceCard from './WorkspaceCard';
import ListingHeader from './ListingHeader';
import withContext from '../hocs/withContext';
import { getHierarchies, getFavoriteHierarchies } from '../selectors';

const cardTypes = {
  'Gestalt::Resource::Organization': 'organization',
  'Gestalt::Resource::Workspace': 'workspace',
  'Gestalt::Resource::Environment': 'environment',
};

class HierarchyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    favoriteHierarchies: PropTypes.array.isRequired,
    hierarchies: PropTypes.array.isRequired,
  };

  state = {
    sortKey: 'description',
    order: 'asc',
  };

  sort = memoize((array, sortKey, order) => orderBy(array, sortKey, order));

  setSortKey = (sortKey) => {
    this.setState({ sortKey });
  }

  setSortOrder = (order) => {
    this.setState({ order });
  }

  renderCard(item) {
    switch (cardTypes[item.resource_type]) {
      case 'organization':
        return <OrganizationCard model={item} {...this.props} />;
      case 'workspace':
        return <WorkspaceCard model={item} {...this.props} />;
      default:
        return <OrganizationCard model={item} {...this.props} />;
    }
  }

  renderNoData() {
    const { hierarchyContext } = this.props;
    const { contextPending, context } = hierarchyContext;
    const { organization } = context;

    if (contextPending) {
      return null;
    }

    return (
      <Row center paddingTop="120px" direction="column">
        <Col flex>
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
        </Col>
      </Row>
    );
  }

  render() {
    const { hierarchyContext, hierarchies, favoriteHierarchies } = this.props;
    const { contextPending } = hierarchyContext;

    if (contextPending) {
      return <ActivityContainer id="hierarchy-listing--loading" />;
    }

    const { sortKey, order } = this.state;
    const sortedHierarchies = this.sort(hierarchies, sortKey, order);

    if (!hierarchies.length && !favoriteHierarchies.length) {
      return this.renderNoData();
    }

    return (
      <React.Fragment>
        {favoriteHierarchies.length > 0 && (
          <Row gutter={5} padding="5px">

            <Col flex={12}>
              <Title>Favorites</Title>
            </Col>

            {favoriteHierarchies.map(item => (
              <Col key={item.id} flex={2} xs={12} sm={6} md={4}>
                {this.renderCard(item)}
              </Col>
            ))}

            <Col flex={12}>
              <Divider width="2px" />
            </Col>
          </Row>
        )}

        <Row gutter={5} padding="5px">
          {hierarchies.length > 0 && (
            <Col flex={12}>
              <ListingHeader
                leftItems={
                  <Sort
                    disabled={!sortedHierarchies.length}
                    sortKey={this.state.sortKey}
                    order={this.state.order}
                    setKey={this.setSortKey}
                    setOrder={this.setSortOrder}
                  />
                }
              />
            </Col>
          )}

          {sortedHierarchies.map(item => (
            <Col key={item.id} flex={2} xs={12} sm={6} md={4}>
              {this.renderCard(item)}
            </Col>
          ))}
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  favoriteHierarchies: getFavoriteHierarchies(state),
  hierarchies: getHierarchies(state),
});

export default compose(
  withContext(),
  connect(mapStateToProps)
)(HierarchyListing);

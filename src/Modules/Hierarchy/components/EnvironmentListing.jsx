import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import { EnvironmentIcon } from 'components/Icons';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { NoData } from 'components/TableCells';
import Sort from './Sort';
import ListingHeader from './ListingHeader';
import EnvironmentCard from './EnvironmentCard';
import withContext from '../hocs/withContext';

class EnvironmentListing extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    filteredEnvironments: PropTypes.array.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
  };

  state = {
    sortKey: 'created.timestamp',
    order: 'asc'
  }

  setSortKey = (sortKey) => {
    this.setState({ sortKey });
  }

  setSortOrder = (order) => {
    this.setState({ order });
  }

  render() {
    const { match, hierarchyContext: { contextPending, context }, filteredEnvironments } = this.props;

    if (!contextPending && !context.environments.length) {
      return (
        <Row center paddingTop="120px">
          <Col flex>
            <NoData
              message="There are no environments to display"
              icon={<EnvironmentIcon size={180} />}
              createPath={{ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/createEnvironment`, state: { modal: true } }}
              createLabel="Create an Environment"
            />
          </Col>
        </Row>
      );
    }

    const { sortKey, order } = this.state;
    const sortedEnvironments = orderBy(filteredEnvironments, sortKey, order);

    return (
      <React.Fragment>
        {contextPending && <ActivityContainer id="environments-listing--loading" />}
        <ListingHeader
          leftItems={
            <Sort
              disabled={!filteredEnvironments.length}
              sortKey={sortKey}
              order={order}
              setKey={this.setSortKey}
              setOrder={this.setSortOrder}
              isEnvironment
            />
          }
          rightItems={
            <SelectFilter disabled={contextPending} />
          }
        />
        <Row gutter={5} padding="5px">
          {sortedEnvironments.map(item => (
            <Col key={item.id} flex={2} xs={12} sm={6} md={4}>
              <EnvironmentCard
                model={item}
                {...this.props}
              />
            </Col>)
          )}
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  filteredEnvironments: listSelectors.filterItems(['name', 'description'])(state, 'hierarchy.context.environments'),
});

export default compose(
  withContext(),
  connect(mapStateToProps)
)(EnvironmentListing);

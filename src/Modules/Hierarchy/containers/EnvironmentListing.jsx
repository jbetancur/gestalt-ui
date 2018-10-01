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
import Sort from '../components/Sort';
import ListingHeader from '../components/ListingHeader';
import EnvironmentCard from './EnvironmentCard';
import withContext from '../hocs/withContext';

class EnvironmentListing extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    filteredEnvironments: PropTypes.array.isRequired,
    contextPending: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'created.timestamp',
      order: 'asc'
    };
  }

  setSortKey = (sortKey) => {
    this.setState({ sortKey });
  }

  setSortOrder = (order) => {
    this.setState({ order });
  }

  render() {
    const { match, contextPending, filteredEnvironments } = this.props;
    const sortedEnvironments = orderBy(filteredEnvironments, this.state.sortKey, this.state.order);

    return (
      <React.Fragment>
        {contextPending && <ActivityContainer id="environments-listing--loading" />}
        <ListingHeader
          leftItems={
            <Sort
              disabled={!filteredEnvironments.length}
              sortKey={this.state.sortKey}
              order={this.state.order}
              setKey={this.setSortKey}
              setOrder={this.setSortOrder}
              isEnvironment
            />
          }
          rightItems={
            <SelectFilter disabled={contextPending} />
          }
        />
        <Row gutter={5}>
          {sortedEnvironments.map(item => (
            <Col key={item.id} flex={2} xs={12} sm={6} md={4}>
              <EnvironmentCard
                model={item}
                {...this.props}
              />
            </Col>)
          )}

          {!contextPending && !filteredEnvironments.length &&
          <Row center fill paddingTop="120px">
            <NoData
              message="There are no environments to display"
              icon={<EnvironmentIcon size={180} />}
              createPath={{ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/createEnvironment`, state: { modal: true } }}
              createLabel="Create an Environment"
            />
          </Row>}
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

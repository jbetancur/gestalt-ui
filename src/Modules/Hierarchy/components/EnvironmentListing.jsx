import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import memoize from 'memoize-one';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import { EnvironmentIcon } from 'components/Icons';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { NoData } from 'components/TableCells';
import { Title } from 'components/Typography';
import Divider from 'components/Divider';
import Sort from './Sort';
import ListingHeader from './ListingHeader';
import EnvironmentCard from './EnvironmentCard';
import withContext from '../hocs/withContext';
import { getEnvironments, getFavoriteEnvironments } from '../selectors';

class EnvironmentListing extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    favoriteEnvironments: PropTypes.array.isRequired,
    filteredEnvironments: PropTypes.array.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
  };

  state = {
    sortKey: 'created.timestamp',
    order: 'asc'
  }

  sort = memoize((array, sortKey, order) => orderBy(array, sortKey, order));

  setSortKey = (sortKey) => {
    this.setState({ sortKey });
  }

  setSortOrder = (order) => {
    this.setState({ order });
  }

  render() {
    const {
      match,
      hierarchyContext: { contextPending, context },
      filteredEnvironments,
      favoriteEnvironments,
    } = this.props;

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
    const sortedEnvironments = this.sort(filteredEnvironments, sortKey, order);
    const showHeader = favoriteEnvironments.length !== context.environments.length && context.environments.length > 0;
    const showNoResults = !contextPending && !filteredEnvironments.length > 0 && showHeader;

    return (
      <React.Fragment>
        {contextPending && <ActivityContainer id="environments-listing--loading" />}
        {favoriteEnvironments.length > 0 && (
          <Row gutter={5} padding="5px">
            <Col flex={12}>
              <Title>Favorites</Title>
            </Col>

            {favoriteEnvironments.map(item => (
              <Col key={item.id} flex={2} xs={12} sm={6} md={4}>
                <EnvironmentCard
                  model={item}
                  {...this.props}
                />
              </Col>)
            )}

            <Col flex={12}>
              <Divider width="2px" />
            </Col>
          </Row>
        )}

        <Row gutter={5} padding="5px">
          {showHeader && (
            <Col flex={12}>
              <ListingHeader
                leftItems={(
                  <Sort
                    disabled={!filteredEnvironments.length}
                    sortKey={sortKey}
                    order={order}
                    setKey={this.setSortKey}
                    setOrder={this.setSortOrder}
                    isEnvironment
                  />
                )}
                rightItems={
                  <SelectFilter disabled={contextPending} />
                }
              />
            </Col>
          )}

          {showNoResults && (
            <NoData
              message="No Environments found in your search"
              showCreate={false}
            />
          )}

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
  favoriteEnvironments: getFavoriteEnvironments(state),
  filteredEnvironments: listSelectors.filterItems(['name', 'description'])(state, getEnvironments),
});

export default compose(
  withContext(),
  connect(mapStateToProps)
)(EnvironmentListing);

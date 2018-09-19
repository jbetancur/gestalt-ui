import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { withEnvironments } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import { EnvironmentIcon } from 'components/Icons';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { NoData } from 'components/TableCells';
import { generateContextEntityState } from 'util/helpers/context';
import Sort from '../components/Sort';
import ListingHeader from '../components/ListingHeader';
import EnvironmentCard from './EnvironmentCard';

class EnvironmentListing extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    environmentsActions: PropTypes.object.isRequired,
    environments: PropTypes.array.isRequired,
    environmentsPending: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'created.timestamp',
      order: 'asc'
    };
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.workspaceId !== this.props.match.params.workspaceId) {
      this.init();
    }
  }

  setSortKey = (sortKey) => {
    this.setState({ sortKey });
  }

  setSortOrder = (order) => {
    this.setState({ order });
  }

  init() {
    const { match, environmentsActions } = this.props;
    const entity = generateContextEntityState(match.params);

    environmentsActions.fetchEnvironments({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  render() {
    const { match, environments, environmentsPending } = this.props;
    const sortedEnvironments = orderBy(this.props.environments, this.state.sortKey, this.state.order);

    return (
      <React.Fragment>
        {this.props.environmentsPending && <ActivityContainer id="environments-listing--loading" />}
        <ListingHeader
          leftItems={
            <Sort
              disabled={!this.props.environments.length}
              sortKey={this.state.sortKey}
              order={this.state.order}
              setKey={this.setSortKey}
              setOrder={this.setSortOrder}
              isEnvironment
            />
          }
          rightItems={
            <SelectFilter disabled={environmentsPending} />
          }
        />
        <Row gutter={5} minColWidths={310}>
          {sortedEnvironments.map(item => (
            <Col key={item.id} flex={2} xs={12} sm={6} md={4}>
              <EnvironmentCard
                model={item}
                {...this.props}
              />
            </Col>)
          )}

          {!environmentsPending && !environments.length &&
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
  environments: listSelectors.filterItems(['name', 'description'])(state, 'hierarchy.environments.environments'),
});

export default compose(
  withEnvironments(),
  connect(mapStateToProps)
)(EnvironmentListing);

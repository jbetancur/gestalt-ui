import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { withMetaResource } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import { EnvironmentIcon } from 'components/Icons';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { NoData } from 'components/TableCells';
import Sort from '../components/Sort';
import ListingHeader from '../components/ListingHeader';
import EnvironmentCard from './EnvironmentCard';

class EnvironmentListing extends Component {
  static propTypes = {
    environments: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
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
    const { match } = this.props;

    this.init(match.params.fqon, match.params.workspaceId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.workspaceId !== this.props.match.params.workspaceId) {
      this.init(this.props.match.params.fqon, this.props.match.params.workspaceId);
    }
  }

  setSortKey = (sortKey) => {
    this.setState({ sortKey });
  }

  setSortOrder = (order) => {
    this.setState({ order });
  }

  init(fqon, workspaceId) {
    this.props.fetchEnvironments(fqon, workspaceId);
  }

  render() {
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
            <SelectFilter disabled={this.props.environmentsPending} />
          }
        />
        <Row gutter={5} minColWidths={310}>
          {sortedEnvironments.map(item => (
            <Col key={item.id} flex={2} xs={12}>
              <EnvironmentCard
                model={item}
                {...this.props}
              />
            </Col>)
          )}

          {!this.props.environmentsPending && !this.props.environments.length &&
          <Row center fill paddingTop="120px">
            <NoData
              message="There are no environments to display"
              icon={<EnvironmentIcon size={150} />}
              showCreate={false}
            />
          </Row>}
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  environments: listSelectors.filterItems(['name', 'description'])(state, 'environments', 'environments'),
});

export default compose(
  withMetaResource,
  connect(mapStateToProps)
)(EnvironmentListing);

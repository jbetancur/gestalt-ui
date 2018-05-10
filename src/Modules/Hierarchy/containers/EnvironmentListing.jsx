import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { withMetaResource } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import Sort from '../components/Sort';
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

    return [
      this.props.environmentsPending && <ActivityContainer key="environments-listing--loading" id="environments-listing--loading" />,
      <Row key="environment--listing" gutter={5} paddingLeft="1em" alignItems="center">
        <Col flex={2} xs={9} sm={3}>
          <Sort
            visible={sortedEnvironments.length > 0}
            sortKey={this.state.sortKey}
            order={this.state.order}
            setKey={this.setSortKey}
            setOrder={this.setSortOrder}
            isEnvironment
          />
        </Col>
      </Row>,
      <Row key="environment--cards" gutter={5} minColWidths={310}>
        {sortedEnvironments.map(item => (
          <Col key={item.id} flex={2} xs={12}>
            <EnvironmentCard
              model={item}
              {...this.props}
            />
          </Col>)
        )}
      </Row>
    ];
  }
}

export default compose(
  withMetaResource
)(EnvironmentListing);

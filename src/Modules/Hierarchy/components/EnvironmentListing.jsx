import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withContext } from 'Modules/ContextManagement';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import Sort from './Sort';
import EnvironmentCard from './EnvironmentCard';

class EnvironmentListing extends Component {
  static propTypes = {
    environments: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    environmentsPending: PropTypes.bool.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'created.timestamp',
      order: 'asc'
    };
  }

  componentDidMount() {
    const { match, contextManagerActions } = this.props;

    this.init(match.params.fqon, match.params.workspaceId);
    contextManagerActions.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.workspaceId !== this.props.match.params.workspaceId) {
      this.init(nextProps.match.params.fqon, nextProps.match.params.workspaceId);
    }
  }

  componentWillUnmount() {
    this.props.unloadEnvironments();
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
      <Row key="environment--cards" gutter={5} minColWidths={315}>
        {sortedEnvironments.map(item => (
          <Col key={item.id} flex={3} xs={12}>
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
  withContext,
  withMetaResource
)(EnvironmentListing);

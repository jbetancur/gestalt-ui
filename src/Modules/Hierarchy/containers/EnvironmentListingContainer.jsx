import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import Sort from '../components/Sort';
import EnvironmentCard from '../components/EnvironmentCard';
import actions from '../actions';

class EnvironmentListing extends Component {
  static propTypes = {
    environments: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    environmentsPending: PropTypes.bool.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
    unloadNavigation: PropTypes.func.isRequired,
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

  renderCardsContainer() {
    const sortedEnvironments = orderBy(this.props.environments, this.state.sortKey, this.state.order);

    return [
      <Row gutter={5} paddingLeft="1em" alignItems="center">
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
      <Row gutter={5} minColWidths={315}>
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

  render() {
    return this.props.environmentsPending ? <ActivityContainer id="environments-progress" /> : this.renderCardsContainer();
  }
}

export default withMetaResource(
  connect(null, actions)(withTheme(EnvironmentListing))
);

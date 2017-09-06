import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import { appActions } from 'App';
import { withMetaResource } from 'modules/MetaResource';
import { translate } from 'react-i18next';
import ActivityContainer from 'components/ActivityContainer';
import Sort from '../../components/Sort';
import EnvironmentCard from '../../components/EnvironmentCard';
import actions from '../../actions';

class EnvironmentListing extends Component {
  static propTypes = {
    environments: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    setCurrentEnvironmentContext: PropTypes.func.isRequired,
    environmentsPending: PropTypes.bool.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
    unloadNavigation: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { sortKey: 'created.timestamp', order: 'asc' };

    this.navEnvironmentDetails = this.navEnvironmentDetails.bind(this);
    this.edit = this.edit.bind(this);
    this.setSortKey = this.setSortKey.bind(this);
    this.setSortOrder = this.setSortOrder.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    this.init(match.params.fqon, match.params.workspaceId);
    this.props.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.workspaceId !== this.props.match.params.workspaceId) {
      this.init(nextProps.match.params.fqon, nextProps.match.params.workspaceId);
    }
  }

  componentWillUnmount() {
    this.props.unloadEnvironments();
  }

  setSortKey(sortKey) {
    this.setState({ sortKey });
  }

  setSortOrder(order) {
    this.setState({ order });
  }

  init(fqon, workspaceId) {
    this.props.fetchEnvironments(fqon, workspaceId);
  }

  navEnvironmentDetails(item) {
    const { match, history, setCurrentEnvironmentContext, unloadNavigation } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${item.id}`);
    setCurrentEnvironmentContext(item);
    unloadNavigation('environment');
  }

  edit(e, environment) {
    const { match, history } = this.props;

    e.stopPropagation();
    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${environment.id}/edit`);
  }

  renderCardsContainer() {
    const sortedEnvironments = orderBy(this.props.environments, this.state.sortKey, this.state.order);

    return (
      <Row gutter={5} minColWidths={315}>
        <Sort
          visible={sortedEnvironments.length > 0}
          sortKey={this.state.sortKey}
          order={this.state.order}
          setKey={this.setSortKey}
          setOrder={this.setSortOrder}
        />
        {sortedEnvironments.map(item => (
          <Col key={item.id} flex={3} xs={12}>
            <EnvironmentCard
              model={item}
              onEditToggle={this.edit}
              onNavigationToggle={this.navEnvironmentDetails}
              {...this.props}
            />
          </Col>)
        )}
      </Row>
    );
  }

  renderProgress() {
    return <ActivityContainer id="environments-progress" />;
  }

  render() {
    return this.props.environmentsPending ? this.renderProgress() : this.renderCardsContainer();
  }
}

export default withMetaResource(
  connect(null, Object.assign({}, actions, appActions))(translate()(withTheme(EnvironmentListing)))
);

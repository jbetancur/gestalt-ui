import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import { appActions } from 'App';
import { withMetaResource } from 'modules/MetaResource';
import { translate } from 'react-i18next';
import ActivityContainer from 'components/ActivityContainer';
import Sort from 'components/Sort';
import EnvironmentCard from '../../components/EnvironmentCard';
import actions from '../../actions';

class EnvironmentListing extends PureComponent {
  static propTypes = {
    environments: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    setCurrentEnvironmentContext: PropTypes.func.isRequired,
    environmentsPending: PropTypes.bool.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { sortKey: 'created.timestamp', order: 'asc' };

    this.navEnvironmentDetails = this.navEnvironmentDetails.bind(this);
    this.edit = this.edit.bind(this);
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

  init(fqon, workspaceId) {
    this.props.fetchEnvironments(fqon, workspaceId);
  }

  navEnvironmentDetails(item) {
    const { match, history, setCurrentEnvironmentContext } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${item.id}`);
    setCurrentEnvironmentContext(item);
  }

  edit(e, environment) {
    const { match, history } = this.props;

    e.stopPropagation();
    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${environment.id}/edit`);
  }

  renderCardsContainer() {
    const sortedEnvironments = orderBy(this.props.environments, this.state.sortKey, this.state.order);

    return (
      <div className="flex-row">
        <Sort
          visible={sortedEnvironments.length > 0}
          sortKey={this.state.sortKey}
          order={this.state.order}
          setKey={value => this.setState({ sortKey: value })}
          setOrder={value => this.setState({ order: value })}
        />
        {sortedEnvironments.map(item => (
          <EnvironmentCard
            key={item.id}
            model={item}
            onEditToggle={this.edit}
            onNavigationToggle={this.navEnvironmentDetails}
            {...this.props}
          />)
        )}
      </div>
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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { connect } from 'react-redux';
import { appActions } from 'App';
import { withMetaResource } from 'modules/MetaResource';
import { translate } from 'react-i18next';
import CircularActivity from 'components/CircularActivity';
import Sort from 'components/Sort';
import EnvironmentCard from '../../components/EnvironmentCard';
import actions from '../../actions';

class EnvironmentListing extends PureComponent {
  static propTypes = {
    environments: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    environemntsPending: PropTypes.bool.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { sortKey: 'created.timestamp', order: 'asc' };
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
        {sortedEnvironments.map(item => <EnvironmentCard key={item.id} model={item} {...this.props} />)}
      </div>
    );
  }

  renderProgress() {
    return <CircularActivity id="environments-progress" />;
  }

  render() {
    return this.props.environemntsPending ? this.renderProgress() : this.renderCardsContainer();
  }
}

function mapStateToProps() {
  return {};
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, appActions))(translate()(EnvironmentListing)));

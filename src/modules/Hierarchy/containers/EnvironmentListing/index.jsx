import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import { translate } from 'react-i18next';
import CircularActivity from 'components/CircularActivity';
import Sort from 'components/Sort';
import EnvironmentCard from '../../components/EnvironmentCard';
import * as actions from '../../actions';

class EnvironmentContext extends PureComponent {
  static propTypes = {
    // workspace: PropTypes.object.isRequired,
    environments: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { sortKey: 'created.timestamp', order: 'asc' };
  }

  componentDidMount() {
    const { params } = this.props;
    this.init(params.fqon, params.workspaceId);
    this.props.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.workspaceId !== this.props.params.workspaceId) {
      this.init(nextProps.params.fqon, nextProps.params.workspaceId);
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
        {sortedEnvironments.map(item => <EnvironmentCard model={item} {...this.props} />)}
      </div>
    );
  }

  renderProgress() {
    return <CircularActivity id="environments-progress" />;
  }

  render() {
    return this.props.pending ? this.renderProgress() : this.renderCardsContainer();
  }
}

function mapStateToProps(state) {
  return {
    environments: state.metaResource.environments.environments,
    pending: state.metaResource.environments.pending
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(translate()(EnvironmentContext));

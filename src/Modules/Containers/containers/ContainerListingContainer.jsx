import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withMetaResource } from 'Modules/MetaResource';
import { generateContextEntityState } from 'util/helpers/transformations';
import ContainerItem from '../components/ContainerItem';
import actions from '../actions';

class ContainerListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    containers: PropTypes.array.isRequired,
    containersPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    fetchContainers: PropTypes.func.isRequired,
    unloadContainers: PropTypes.func.isRequired,
    fetchActions: PropTypes.func.isRequired,
    providerContext: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { fetchActions, match } = this.props;
    const entity = generateContextEntityState(match.params);

    this.init();
    fetchActions(match.params.fqon, entity.id, entity.key, { filter: 'container.detail' });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.containers !== nextProps.containers) {
      clearTimeout(this.timeout);

      if (!nextProps.containersPending) {
        this.startPoll();
      }
    }
  }

  componentWillUnmount() {
    this.props.unloadContainers();
    clearTimeout(this.timeout);
  }

  startPoll() {
    this.timeout = setInterval(() => this.init(true), 5000);
  }

  init(isPolling) {
    const { match, fetchContainers } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchContainers(match.params.fqon, entity.id, entity.key, isPolling);
  }

  edit = (container, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push(`${match.url}/${container.id}`);
    }
  }

  render() {
    return (
      <ContainerItem
        model={this.props.containers}
        pending={this.props.containersPending}
        onEditToggle={this.edit}
        {...this.props}
      />
    );
  }
}

export default compose(
  withMetaResource,
  withRouter,
  connect(null, { ...actions }),
)(ContainerListing);

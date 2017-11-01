import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
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
  };

  componentDidMount() {
    const { fetchActions, match } = this.props;

    this.init();
    fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'container.detail' });
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
    fetchContainers(match.params.fqon, match.params.environmentId, isPolling);
  }

  edit = (container, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push(`${match.url}/${container.id}/edit`);
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

export default withMetaResource(connect(null, { ...actions })(ContainerListing));

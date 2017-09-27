import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { withTableManager } from 'modules/TableManager';
import ContainerItem from '../../components/ContainerItem';
import actions from '../../actions';

class ContainerListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    containers: PropTypes.array.isRequired,
    containersPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    fetchContainers: PropTypes.func.isRequired,
    unloadContainers: PropTypes.func.isRequired,
    // fetchActions: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.edit = this.edit.bind(this);
  }

  componentDidMount() {
    // const { fetchActions, match } = this.props;

    this.init();
    // fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'container.detail' });
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
    this.timeout = setTimeout(() => this.init(true), 5000);
  }

  init(isPolling) {
    const { match, fetchContainers } = this.props;
    fetchContainers(match.params.fqon, match.params.environmentId, isPolling);
  }

  edit(container, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push({
        pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/containers/${container.id}/edit`
      });
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

export default withTableManager(withMetaResource(connect(null, { ...actions })(withContext(ContainerListing))));

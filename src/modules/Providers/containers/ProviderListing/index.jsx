import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import ProviderItem from '../../components/ProviderItem';
import actions from '../../actions';

class ProviderListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    selectedProviders: PropTypes.object.isRequired,
    deleteProviders: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    unloadProviders: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    providersPending: PropTypes.bool.isRequired,
    showProviderInstanceModal: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const { match, fetchProviders } = this.props;
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.environmentId ? 'environments' : 'workspaces';

    fetchProviders(match.params.fqon, entityId, entityKey);
  }

  componentWillUnmount() {
    const { unloadProviders, clearTableSelected, clearTableSort } = this.props;
    unloadProviders();
    clearTableSelected();
    clearTableSort();
  }

  create() {
    const { history, match } = this.props;

    // note the workspaceId and environmentId here are passed into the component
    // via the EnvironmentDetail Component they are not props.match
    if (match.params.workspaceId && !match.params.environmentId) {
      history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers/create` });
    } else if (match.params.environmentId) {
      history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/providers/create` });
    } else {
      history.push({ pathname: `/${match.params.fqon}/providers/create` });
    }
  }

  edit(provider, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;

      if (match.params.workspaceId && !match.params.environmentId) {
        history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers/${provider.id}/edit` });
      } else if (match.params.environmentId) {
        history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/providers/${provider.id}/edit` });
      } else {
        history.push({ pathname: `/${match.params.fqon}/providers/${provider.id}/edit` });
      }
    }
  }

  delete() {
    const { match, fetchProviders, deleteProviders, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedProviders;
    const providerIds = selectedItems.map(item => (item.id));
    const providerNames = selectedItems.map(item => (item.name));

    if (match.params.workspaceId && !match.params.environmentId) {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(match.params.fqon, match.params.workspaceId, 'workspaces');
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, match.params.fqon, match.params.workspaceId, 'workspaces', onSuccess);
      }, providerNames);
    } else if (match.params.environmentId) {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(match.params.fqon, match.params.environmentId, 'environments');
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, match.params.fqon, match.params.environmentId, 'environments', onSuccess);
      }, providerNames);
    } else {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(match.params.fqon);
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, match.params.fqon, null, null, onSuccess);
      }, providerNames);
    }
  }

  handleInstanceModalFinish() {
    this.props.showProviderInstanceModal();
  }

  render() {
    return (
      <ProviderItem
        model={this.props.providers}
        pending={this.props.providersPending}
        onCreateToggle={this.create}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        onToggleInstanceModal={() => this.handleInstanceModalFinish()}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    providers: orderBy(state.metaResource.providers.providers, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedProviders: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(withContext(ProviderListing)));

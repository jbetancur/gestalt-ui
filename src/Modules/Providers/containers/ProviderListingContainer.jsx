import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withTableManager } from 'Modules/TableManager';
import { generateContextEntityState } from 'util/helpers/transformations';
import ProviderItem from '../components/ProviderItem';
import actions from '../actions';

class ProviderListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deleteProviders: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    unloadProviders: PropTypes.func.isRequired,
    providersPending: PropTypes.bool.isRequired,
    showProviderInstanceModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchProviders } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchProviders(match.params.fqon, entity.id, entity.key);
  }

  componentWillUnmount() {
    const { unloadProviders } = this.props;

    unloadProviders();
  }

  edit = (provider, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;

      if (match.params.workspaceId && !match.params.environmentId) {
        history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers/${provider.id}` });
      } else if (match.params.environmentId) {
        history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers/${provider.id}/edit` });
      } else {
        history.push({ pathname: `/${match.params.fqon}/providers/${provider.id}/edit` });
      }
    }
  }

  delete = () => {
    const { match, fetchProviders, deleteProviders, tableActions } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const providerIds = items.map(item => (item.id));
    const providerNames = items.map(item => (item.name));

    if (match.params.workspaceId && !match.params.environmentId) {
      const onSuccess = () => {
        tableActions.clearTableSelected();
        fetchProviders(match.params.fqon, match.params.workspaceId, 'workspaces');
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, match.params.fqon, match.params.workspaceId, 'workspaces', onSuccess);
      }, providerNames);
    } else if (match.params.environmentId) {
      const onSuccess = () => {
        tableActions.clearTableSelected();
        fetchProviders(match.params.fqon, match.params.environmentId, 'environments');
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, match.params.fqon, match.params.environmentId, 'environments', onSuccess);
      }, providerNames);
    } else {
      const onSuccess = () => {
        tableActions.clearTableSelected();
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
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        onToggleInstanceModal={() => this.handleInstanceModalFinish()}
        {...this.props}
      />
    );
  }
}

export default withTableManager(withMetaResource(connect(null, { ...actions })(ProviderListing)));

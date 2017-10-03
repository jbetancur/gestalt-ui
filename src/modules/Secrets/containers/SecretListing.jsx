import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { withTableManager } from 'modules/TableManager';
import SecretItem from '../components/SecretItem';
import actions from '../actions';

class SecretListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    secrets: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deleteSecrets: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchSecrets: PropTypes.func.isRequired,
    unloadSecretsModal: PropTypes.func.isRequired,
    secretsPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchSecrets } = this.props;

    fetchSecrets(match.params.fqon, match.params.environmentId);
  }

  componentWillUnmount() {
    const { unloadSecretsModal } = this.props;

    unloadSecretsModal();
  }

  edit = (secret, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;

      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/secrets/${secret.id}/edit`);
    }
  }

  delete = () => {
    const { match, deleteSecrets, tableActions, fetchSecrets } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const IDs = items.map(item => (item.id));
    const names = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
      fetchSecrets(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteSecrets(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  render() {
    return (
      <SecretItem
        model={this.props.secrets}
        pending={this.props.secretsPending}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

export default withMetaResource(connect(null, { ...actions })(withContext(withTableManager(SecretListing))));

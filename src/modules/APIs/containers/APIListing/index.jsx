import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'modules/MetaResource';
import { withContext } from 'modules/ContextManagement';
import { withTableManager } from 'modules/TableManager';
import APIItem from '../../components/APIItem';
import actions from '../../actions';

class APIListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apis: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deleteAPIs: PropTypes.func.isRequired,
    apisPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIs: PropTypes.func.isRequired,
    unloadAPIs: PropTypes.func.isRequired,

  };

  componentDidMount() {
    const { match, fetchAPIs } = this.props;
    fetchAPIs(match.params.fqon, match.params.environmentId);
  }

  componentWillUnmount() {
    const { unloadAPIs } = this.props;
    unloadAPIs();
  }

  edit = (api, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/${api.id}/edit`);
    }
  }

  delete = () => {
    const { match, fetchAPIs, deleteAPIs, tableActions } = this.props;
    const { items } = this.props.tableManager;
    const IDs = items.map(item => (item.id));
    const names = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
      fetchAPIs(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteAPIs(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  render() {
    return (
      <APIItem
        model={this.props.apis}
        pending={this.props.apisPending}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

export default withTableManager(withMetaResource(connect(null, { ...actions })(withContext(APIListing))));

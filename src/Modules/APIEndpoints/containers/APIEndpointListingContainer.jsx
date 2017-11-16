import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withTableManager } from 'Modules/TableManager';
import APIEndpointItem from '../components/APIEndpointItem';
import actions from '../actions';

class APIEndpointList extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deleteAPIEndpoints: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchAPIEndpoints } = this.props;

    fetchAPIEndpoints(match.params.fqon, match.params.apiId);
  }

  componentWillUnmount() {
    const { unloadAPIEndpoints } = this.props;

    unloadAPIEndpoints();
  }

  delete = () => {
    const { match, fetchAPIEndpoints, deleteAPIEndpoints, tableActions } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const IDs = items.map(item => (item.id));
    const names = items.map(item => (item.properties.resource));

    const onSuccess = () => {
      tableActions.clearTableSelected();
      fetchAPIEndpoints(match.params.fqon, match.params.apiId);
    };

    this.props.confirmDelete(() => {
      deleteAPIEndpoints(IDs, match.params.fqon, match.params.apiId, onSuccess);
    }, names);
  }

  edit = (apiEndpoint, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match, } = this.props;
      history.push({
        pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}/apiendpoints/${apiEndpoint.id}`,
        search: `?implementationType=${apiEndpoint.properties.implementation_type}`
      });
    }
  }

  render() {
    return (
      <APIEndpointItem
        model={this.props.apiEndpoints}
        pending={this.props.apiEndpointsPending}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

export default withTableManager(withMetaResource(connect(null, { ...actions })(APIEndpointList)));

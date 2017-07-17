import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import APIEndpointItem from '../../components/APIEndpointItem';
import actions from '../../actions';

class APIEndpointList extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    selectedEndpoints: PropTypes.object.isRequired,
    deleteAPIEndpoints: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
  };

  constructor() {
    super();

    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const { match, fetchAPIEndpoints } = this.props;
    fetchAPIEndpoints(match.params.fqon, match.params.apiId);
  }

  componentWillUnmount() {
    const { unloadAPIEndpoints, clearTableSelected, clearTableSort } = this.props;
    unloadAPIEndpoints();
    clearTableSelected();
    clearTableSort();
  }

  delete() {
    const { match, fetchAPIEndpoints, deleteAPIEndpoints, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedEndpoints;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.properties.resource));

    const onSuccess = () => {
      clearTableSelected();
      fetchAPIEndpoints(match.params.fqon, match.params.apiId);
    };

    this.props.confirmDelete(() => {
      deleteAPIEndpoints(IDs, match.params.fqon, match.params.apiId, onSuccess);
    }, names);
  }

  create() {
    const { match, history } = this.props;
    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/${match.params.apiId}/edit/apiendpoints/createEndpoint`);
  }

  edit(apiEndpoint, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match, } = this.props;
      history.push({
        pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/${match.params.apiId}/edit/apiendpoints/${apiEndpoint.id}/editEndpoint`,
        search: `?implementationType=${apiEndpoint.properties.implementation_type}`
      });
    }
  }

  render() {
    return (
      <APIEndpointItem
        model={this.props.apiEndpoints}
        pending={this.props.apiEndpointsPending}
        onCreateToggle={this.create}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    apiEndpoints: orderBy(state.metaResource.apiEndpoints.apiEndpoints, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedEndpoints: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(withContext(APIEndpointList)));

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'react-md/lib/Cards/Card';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons/Button';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { DeleteIconButton } from 'components/Buttons';

class apiEndpointItem extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    selectedEndpoints: PropTypes.object.isRequired,
    handleSelected: PropTypes.func.isRequired,
    deleteAPIEndpoints: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { params, fetchAPIEndpoints } = this.props;
    fetchAPIEndpoints(params.fqon, params.apiId);
  }

  componentWillUnmount() {
    const { unloadAPIEndpoints, clearSelected } = this.props;
    unloadAPIEndpoints();
    clearSelected();
  }

  handleRowToggle(row, toggled, count) {
    const { apiEndpoints, handleSelected, selectedEndpoints } = this.props;

    handleSelected(row, toggled, count, apiEndpoints, selectedEndpoints.selectedItems);
  }

  delete() {
    const { params, fetchAPIEndpoints, deleteAPIEndpoints, clearSelected } = this.props;
    const { selectedItems } = this.props.selectedEndpoints;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearSelected();
      fetchAPIEndpoints(params.fqon, params.apiId);
    };

    this.props.confirmDelete(() => {
      deleteAPIEndpoints(IDs, params.fqon, params.apiId, onSuccess);
    }, names);
  }

  edit(apiEndpoint, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params, } = this.props;
      router.push({
        pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/apis/${params.apiId}/edit/apiendpoints/${apiEndpoint.id}/editEndpoint`
      });
    }
  }

  renderCreateButton() {
    const { params } = this.props;

    return (
      <Button
        id="create-endpoint"
        label="Create Endpoint"
        flat
        primary
        component={Link}
        to={{
          pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/apis/${params.apiId}/edit/apiendpoints/createEndpoint`
        }}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedEndpoints;
    const apiEndpoints = this.props.apiEndpoints.map(apiEndpoint => (
      <TableRow key={apiEndpoint.id} onClick={e => this.edit(apiEndpoint, e)}>
        <TableColumn>{apiEndpoint.name}</TableColumn>
        <TableColumn>
          <a href={apiEndpoint.properties.upstream_url} target="_blank" rel="noopener noreferrer">{apiEndpoint.properties.upstream_url}</a>
        </TableColumn>
        {/* <TableColumn>{apiEndpoint.properties.auth_type.type}</TableColumn>
        <TableColumn>{apiEndpoint.properties.http_method}</TableColumn> */}
        <TableColumn>{apiEndpoint.properties.resource}</TableColumn>
        <TableColumn>{apiEndpoint.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={apiEndpoint.created.timestamp} /> <FormattedTime value={apiEndpoint.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <Card tableCard>
        <TableCardHeader
          title="Endpoints"
          visible={selectedCount > 0}
          contextualTitle={`${selectedCount} endpoint${selectedCount > 1 ? 's' : ''} selected`}
          actions={[<DeleteIconButton onClick={() => this.delete()} />]}
        >
          <div>{this.renderCreateButton()}</div>
        </TableCardHeader>
        {this.props.pending ? <LinearProgress id="apiEndpoint-listing" /> : null}
        <DataTable baseId="apiEndpoints" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
          {!this.props.apiEndpoints.length ? null :
          <TableHeader>
            <TableRow>
              <TableColumn>Name</TableColumn>
              <TableColumn>Upstream Url</TableColumn>
              {/* <TableColumn>Security</TableColumn>
              <TableColumn>HTTP Method</TableColumn> */}
              <TableColumn>Resource Path</TableColumn>
              <TableColumn>Owner</TableColumn>
              <TableColumn>Created</TableColumn>
            </TableRow>
          </TableHeader>}
          <TableBody>
            {apiEndpoints}
          </TableBody>
        </DataTable>
      </Card>
    );
  }
}

export default apiEndpointItem;

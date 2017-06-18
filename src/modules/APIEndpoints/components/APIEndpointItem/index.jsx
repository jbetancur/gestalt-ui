import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton } from 'components/Buttons';
import A from 'components/A';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class apiEndpointItem extends PureComponent {
  static propTypes = {
    params: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    selectedEndpoints: PropTypes.object.isRequired,
    deleteAPIEndpoints: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { params, fetchAPIEndpoints } = this.props;
    fetchAPIEndpoints(params.fqon, params.apiId);
  }

  componentWillUnmount() {
    const { unloadAPIEndpoints, clearTableSelected, clearTableSort } = this.props;
    unloadAPIEndpoints();
    clearTableSelected();
    clearTableSort();
  }

  handleRowToggle(row, toggled, count) {
    const { apiEndpoints, handleTableSelected, selectedEndpoints } = this.props;

    handleTableSelected(row, toggled, count, apiEndpoints, selectedEndpoints.selectedItems);
  }

  delete() {
    const { params, fetchAPIEndpoints, deleteAPIEndpoints, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedEndpoints;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.properties.resource));

    const onSuccess = () => {
      clearTableSelected();
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
        pathname: `${params.fqon}/hierarchy/${params.workspaceId}/environments/${params.environmentId}/apis/${params.apiId}/edit/apiendpoints/${apiEndpoint.id}/editEndpoint`,
        query: { implementationType: apiEndpoint.properties.implementation_type },
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
          pathname: `${params.fqon}/hierarchy/${params.workspaceId}/environments/${params.environmentId}/apis/${params.apiId}/edit/apiendpoints/createEndpoint`
        }}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedEndpoints;
    const { handleTableSortIcon, sortTable } = this.props;

    const apiEndpoints = this.props.apiEndpoints.map(apiEndpoint => (
      <TableRow key={apiEndpoint.id} onClick={e => this.edit(apiEndpoint, e)}>
        <TableColumn>{apiEndpoint.properties.resource}</TableColumn>
        <TableColumn>
          <A href={apiEndpoint.properties.public_url} target="_blank" rel="noopener noreferrer">{apiEndpoint.properties.public_url}</A>
        </TableColumn>
        {/* <TableColumn>{apiEndpoint.properties.auth_type.type}</TableColumn> */}
        <TableColumn><span className="gf-caption">{apiEndpoint.properties.methods && apiEndpoint.properties.methods.join(', ')}</span></TableColumn>
        <TableColumn>{apiEndpoint.properties.rateLimit && apiEndpoint.properties.rateLimit.perMinute}</TableColumn>
        <TableColumn>{apiEndpoint.properties.implementation_type}</TableColumn>
        <TableColumn>{apiEndpoint.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={apiEndpoint.created.timestamp} /> <FormattedTime value={apiEndpoint.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <Card tableCard>
        <TableCardHeader
          title={<div className="gf-headline">Endpoints</div>}
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
              <TableColumn sorted={handleTableSortIcon('properties.resource', true)} onClick={() => sortTable('properties.resource')}>Resource Path</TableColumn>
              {/* <TableColumn>Security</TableColumn> */}
              <TableColumn sorted={handleTableSortIcon('properties.public_url')} onClick={() => sortTable('properties.public_url')}>Public URL</TableColumn>
              <TableColumn>HTTP Methods</TableColumn>
              <TableColumn>Rate Limit (per minute)</TableColumn>
              <TableColumn sorted={handleTableSortIcon('properties.implementation_type')} onClick={() => sortTable('properties.implementation_type')}>Type</TableColumn>
              <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
              <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
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

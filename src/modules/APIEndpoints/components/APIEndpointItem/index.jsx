import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton } from 'components/Buttons';
import A from 'components/A';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import { parseChildClass } from 'util/helpers/strings';

class apiEndpointItem extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    selectedEndpoints: PropTypes.object.isRequired,
    deleteAPIEndpoints: PropTypes.func.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
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
    const { match, fetchAPIEndpoints } = this.props;
    fetchAPIEndpoints(match.params.fqon, match.params.apiId);
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

  renderCreateButton() {
    const { match } = this.props;

    return (
      <Button
        id="create-endpoint"
        label="Create Endpoint"
        flat
        primary
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/${match.params.apiId}/edit/apiendpoints/createEndpoint`}
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
        <TableColumn style={{ color: parseChildClass(apiEndpoint.resource_state) === 'Failed' && 'red' }}>
          {parseChildClass(apiEndpoint.resource_state)}
        </TableColumn>
        <TableColumn>
          <A href={apiEndpoint.properties.public_url} target="_blank" rel="noopener noreferrer">{apiEndpoint.properties.public_url}</A>
        </TableColumn>
        <TableColumn>
          <span className="gf-caption-sm"><span>{apiEndpoint.properties.methods && apiEndpoint.properties.methods.join(',')}</span></span>
        </TableColumn>
        <TableColumn numeric>
          {apiEndpoint.properties.plugins && apiEndpoint.properties.plugins.rateLimit && apiEndpoint.properties.plugins.rateLimit.perMinute}
        </TableColumn>
        <TableColumn>
          <Checkbox style={{ height: '1.4em' }} defaultChecked={apiEndpoint.properties.plugins && apiEndpoint.properties.plugins.gestaltSecurity && apiEndpoint.properties.plugins.gestaltSecurity.enabled} disabled />
        </TableColumn>
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
        {this.props.apiEndpointsPending && <LinearProgress id="apiEndpoint-listing" />}
        <DataTable baseId="apiEndpoints" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
          {this.props.apiEndpoints.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn sorted={handleTableSortIcon('resource_state')} onClick={() => sortTable('resource_state')}>State</TableColumn>
              <TableColumn sorted={handleTableSortIcon('properties.public_url')} onClick={() => sortTable('properties.public_url')}>Public URL</TableColumn>
              <TableColumn>Methods</TableColumn>
              <TableColumn numeric>Rate Limit</TableColumn>
              <TableColumn style={{ padding: 0 }}>Authentication</TableColumn>
              <TableColumn sorted={handleTableSortIcon('properties.implementation_type')} onClick={() => sortTable('properties.implementation_type')}>Type</TableColumn>
              <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
              <TableColumn sorted={handleTableSortIcon('created.timestamp', true)} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
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

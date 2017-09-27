import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import FontIcon from 'react-md/lib/FontIcons';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton } from 'components/Buttons';
import A from 'components/A';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import { parseChildClass } from 'util/helpers/strings';

class apiEndpointItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onCreateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    getTableSortedItems: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleRowToggle = (row, toggled, count) => {
    const { model, tableActions, tableManager } = this.props;

    tableActions.handleTableSelected(row, toggled, count, model, tableManager.tableSelected.items);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-endpoint"
        flat
        primary
        onClick={this.props.onCreateToggle}
        iconChildren="add"
      >
        Create Endpoint
      </Button>
    );
  }

  render() {
    const { count } = this.props.tableManager.tableSelected;
    const { model, tableActions, getTableSortedItems } = this.props;

    const endpoints = getTableSortedItems(model, 'created.timestamp').map(apiEndpoint => (
      <TableRow key={apiEndpoint.id} onClick={e => this.props.onEditToggle(apiEndpoint, e)}>
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
          {apiEndpoint.properties.plugins && apiEndpoint.properties.plugins.rateLimit && apiEndpoint.properties.plugins.rateLimit.enabled && apiEndpoint.properties.plugins.rateLimit.perMinute}
        </TableColumn>
        <TableColumn>
          {apiEndpoint.properties.plugins && apiEndpoint.properties.plugins.gestaltSecurity && apiEndpoint.properties.plugins.gestaltSecurity.enabled && <FontIcon>checked</FontIcon>}
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
          visible={count > 0}
          contextualTitle={`${count} endpoint${count > 1 ? 's' : ''} selected`}
          actions={[<DeleteIconButton onClick={() => this.props.onDeleteToggle()} />]}
        >
          <div>{this.renderCreateButton()}</div>
        </TableCardHeader>
        {this.props.pending && <LinearProgress id="apiEndpoint-listing" />}
        <DataTable baseId="apiEndpoints" onRowToggle={this.handleRowToggle}>
          {this.props.model.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn sorted={tableActions.handleTableSortIcon('resource_state')} onClick={() => tableActions.sortTable('resource_state')}>State</TableColumn>
              <TableColumn sorted={tableActions.handleTableSortIcon('properties.public_url')} onClick={() => tableActions.sortTable('properties.public_url')}>Public URL</TableColumn>
              <TableColumn>Methods</TableColumn>
              <TableColumn numeric>Rate Limit</TableColumn>
              <TableColumn style={{ padding: 0 }}>Authentication</TableColumn>
              <TableColumn sorted={tableActions.handleTableSortIcon('properties.implementation_type')} onClick={() => tableActions.sortTable('properties.implementation_type')}>Type</TableColumn>
              <TableColumn sorted={tableActions.handleTableSortIcon('owner.name')} onClick={() => tableActions.sortTable('owner.name')}>Owner</TableColumn>
              <TableColumn sorted={tableActions.handleTableSortIcon('created.timestamp', true)} onClick={() => tableActions.sortTable('created.timestamp')}>Created</TableColumn>
            </TableRow>
          </TableHeader>}
          <TableBody>
            {endpoints}
          </TableBody>
        </DataTable>
      </Card>
    );
  }
}

export default apiEndpointItem;

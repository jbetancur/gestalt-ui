import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';
import { getLastFromSplit, truncate } from 'util/helpers/strings';

class ProviderItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    providersPending: PropTypes.bool.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    getTableSortedItems: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleRowToggle = (row, toggled, count) => {
    const { model, tableActions, tableManager } = this.props;

    tableActions.handleTableSelected(row, toggled, count, model, tableManager.tableSelected.items);
  }

  render() {
    const { count } = this.props.tableManager.tableSelected;
    const { model, tableActions, getTableSortedItems } = this.props;

    const providers = getTableSortedItems(model, 'name').map(provider => (
      <TableRow key={provider.id} onClick={e => this.props.onEditToggle(provider, e)}>
        <TableColumn>{provider.name}</TableColumn>
        <TableColumn>{truncate(provider.description, 100)}</TableColumn>
        <TableColumn>{provider.resource_type && getLastFromSplit(provider.resource_type)}</TableColumn>
        <TableColumn>{provider.properties.parent.name}</TableColumn>
        <TableColumn>{provider.owner.name}</TableColumn>
        <TableColumnTimestamp timestamp={provider.created.timestamp} />
      </TableRow>
    ));

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}tableCard>
          <TableCardHeader
            title="Providers"
            visible={count > 0}
            contextualTitle={`${count} provider${count > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          />
          {this.props.providersPending && <LinearProgress id="providers-progress" />}
          <DataTable baseId="providers" onRowToggle={this.handleRowToggle}>
            {this.props.model.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn sorted={tableActions.handleTableSortIcon('name', true)} onClick={() => tableActions.sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('description')} onClick={() => tableActions.sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('resource_type')} onClick={() => tableActions.sortTable('resource_type')}>Type</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('properties.parent.name')} onClick={() => tableActions.sortTable('properties.parent.name')}>Parent</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('owner.name')} onClick={() => tableActions.sortTable('owner.name')}>Owner</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('created.timestamp')} onClick={() => tableActions.sortTable('created.timestamp')}>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {providers}
            </TableBody>
          </DataTable>
        </Col>
      </Row>
    );
  }
}

export default ProviderItem;


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';

class SecretItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
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

  render() {
    const { count } = this.props.tableManager.tableSelected;
    const { model, tableActions, getTableSortedItems } = this.props;

    const secrets = getTableSortedItems(model, 'name').map(secret => (
      <TableRow key={secret.id} onClick={e => this.props.onEditToggle(secret, e)}>
        <TableColumn>{secret.name}</TableColumn>
        <TableColumn>{secret.description}</TableColumn>
        <TableColumn>{secret.properties.provider && secret.properties.provider.name}</TableColumn>
        <TableColumn>{secret.owner.name}</TableColumn>
        <TableColumnTimestamp timestamp={secret.created.timestamp} />
      </TableRow>
    ));

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12} tableCard>
          <TableCardHeader
            title="Secrets"
            visible={count > 0}
            contextualTitle={`${count} secret${count > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          />
          {this.props.pending && <LinearProgress id="secret-listing" />}
          <DataTable baseId="Secrets" onRowToggle={this.handleRowToggle}>
            {this.props.model.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn sorted={tableActions.handleTableSortIcon('name', true)} onClick={() => tableActions.sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('description')} onClick={() => tableActions.sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('properties.provider.name')} onClick={() => tableActions.sortTable('properties.provider.name')}>Provider</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('owner.name')} onClick={() => tableActions.sortTable('owner.name')}>Owner</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('created.timestamp')} onClick={() => tableActions.sortTable('created.timestamp')}>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {secrets}
            </TableBody>
          </DataTable>
        </Col>
      </Row>
    );
  }
}

export default SecretItem;

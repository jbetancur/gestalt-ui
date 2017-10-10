import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';

class APIItem extends PureComponent {
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

    const apis = getTableSortedItems(model, 'name').map(api => (
      <TableRow key={api.id} onClick={e => this.props.onEditToggle(api, e)}>
        <TableColumn>{api.name}</TableColumn>
        <TableColumn>{api.description}</TableColumn>
        <TableColumn>{api.owner.name}</TableColumn>
        <TableColumnTimestamp timestamp={api.created.timestamp} />
      </TableRow>
    ));

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12} tableCard>
          <TableCardHeader
            title={<div className="gf-headline">APIs</div>}
            visible={count > 0}
            contextualTitle={`${count} API${count > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          />
          {this.props.pending && <LinearProgress id="api-listing" />}
          <DataTable baseId="apis" onRowToggle={this.handleRowToggle}>
            {this.props.model.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn sorted={tableActions.handleTableSortIcon('name', true)} onClick={() => tableActions.sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('description')} onClick={() => tableActions.sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('owner.name')} onClick={() => tableActions.sortTable('owner.name')}>Owner</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('created.timestamp')} onClick={() => tableActions.sortTable('created.timestamp')}>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {apis}
            </TableBody>
          </DataTable>
        </Col>
      </Row>
    );
  }
}

export default APIItem;

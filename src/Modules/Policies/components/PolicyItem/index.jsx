import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { DeleteIconButton } from 'components/Buttons';
import { truncate } from 'util/helpers/strings';

class PolicyItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    policiesPending: PropTypes.bool.isRequired,
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

    const policies = getTableSortedItems(model, 'name').map(policy => (
      <TableRow key={policy.id} onClick={e => this.props.onEditToggle(policy, e)}>
        <TableColumn>{policy.name}</TableColumn>
        <TableColumn>{truncate(policy.description, 100)}</TableColumn>
        <TableColumn>{policy.owner.name}</TableColumn>
        <TableColumnTimestamp timestamp={policy.created.timestamp} />
      </TableRow>
    ));

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12} tableCard>
          <TableCardHeader
            title={<div className="gf-headline">Policies</div>}
            visible={count > 0}
            contextualTitle={`${count} polic${count > 1 ? 'ies' : 'y'} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          />
          {this.props.policiesPending && <LinearProgress id="policy-listing" />}
          <DataTable baseId="policies" onRowToggle={this.handleRowToggle}>
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
              {policies}
            </TableBody>
          </DataTable>
        </Col>
      </Row>
    );
  }
}

export default PolicyItem;

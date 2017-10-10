import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';

class UserItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    tableManager: PropTypes.object.isRequired,
    model: PropTypes.array.isRequired,
    usersPending: PropTypes.bool.isRequired,
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
    const { model, usersPending, tableActions, getTableSortedItems } = this.props;

    const users = getTableSortedItems(model, 'name').map(user => (
      <TableRow key={user.id} onClick={e => this.props.onEditToggle(user, e)}>
        <TableColumn>{user.name}</TableColumn>
        <TableColumn>{user.description}</TableColumn>
        <TableColumn>{user.properties.firstName}</TableColumn>
        <TableColumn>{user.properties.lastName}</TableColumn>
        <TableColumn numeric>{user.properties.phoneNumber}</TableColumn>
        <TableColumn>{user.properties.email}</TableColumn>
        <TableColumnTimestamp timestamp={user.created.timestamp} />
        <TableColumn>{user.properties.gestalt_home}</TableColumn>
      </TableRow>
    ));

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12} tableCard>
          <TableCardHeader
            title={<div className="gf-headline">Users</div>}
            visible={count > 0}
            contextualTitle={`${count} user${count > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          />
          {usersPending && <LinearProgress id="users-progress" />}
          <DataTable baseId="Users" onRowToggle={this.handleRowToggle}>
            {model.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn sorted={tableActions.handleTableSortIcon('name', true)} onClick={() => tableActions.sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('description')} onClick={() => tableActions.sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('properties.firstName')} onClick={() => tableActions.sortTable('properties.firstName')}>First Name</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('properties.lastName')} onClick={() => tableActions.sortTable('properties.lastName')}>Last Name</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('properties.phoneNumber')} onClick={() => tableActions.sortTable('properties.phoneNumber')}>Phone Number</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('properties.email')} onClick={() => tableActions.sortTable('properties.email')}>Email</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('created.timestamp')} onClick={() => tableActions.sortTable('created.timestamp')}>Created</TableColumn>
                <TableColumn sorted={tableActions.handleTableSortIcon('properties.gestalt_home')} onClick={() => tableActions.sortTable('properties.gestalt_home')}>Home</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {users}
            </TableBody>
          </DataTable>
        </Col>
      </Row>
    );
  }
}

export default UserItem;

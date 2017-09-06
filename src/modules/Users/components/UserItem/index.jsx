import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { FormattedDate, FormattedTime } from 'react-intl';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class UserItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    selectedUsers: PropTypes.object.isRequired,
    model: PropTypes.array.isRequired,
    usersPending: PropTypes.bool.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleRowToggle = this.handleRowToggle.bind(this);
  }

  handleRowToggle(row, toggled, count) {
    const { model, handleTableSelected, selectedUsers } = this.props;

    handleTableSelected(row, toggled, count, model, selectedUsers.selectedItems);
  }

  render() {
    const { selectedCount } = this.props.selectedUsers;
    const { handleTableSortIcon, sortTable } = this.props;

    const users = this.props.model.map(user => (
      <TableRow key={user.id} onClick={e => this.props.onEditToggle(user, e)}>
        <TableColumn>{user.name}</TableColumn>
        <TableColumn>{user.description}</TableColumn>
        <TableColumn>{user.properties.firstName}</TableColumn>
        <TableColumn>{user.properties.lastName}</TableColumn>
        <TableColumn numeric>{user.properties.phoneNumber}</TableColumn>
        <TableColumn>{user.properties.email}</TableColumn>
        <TableColumn><FormattedDate value={user.created.timestamp} /> <FormattedTime value={user.created.timestamp} /></TableColumn>
        <TableColumn>{user.properties.gestalt_home}</TableColumn>
      </TableRow>
    ));

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12} tableCard>
          <TableCardHeader
            title={<div className="gf-headline">Users</div>}
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} user${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          />
          {this.props.usersPending && <LinearProgress id="users-progress" />}
          <DataTable baseId="Users" onRowToggle={this.handleRowToggle}>
            {this.props.model.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={handleTableSortIcon('properties.firstName')} onClick={() => sortTable('properties.firstName')}>First Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('properties.lastName')} onClick={() => sortTable('properties.lastName')}>Last Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('properties.phoneNumber')} onClick={() => sortTable('properties.phoneNumber')}>Phone Number</TableColumn>
                <TableColumn sorted={handleTableSortIcon('properties.email')} onClick={() => sortTable('properties.email')}>Email</TableColumn>
                <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
                <TableColumn sorted={handleTableSortIcon('properties.gestalt_home')} onClick={() => sortTable('properties.gestalt_home')}>Home</TableColumn>
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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedDate, FormattedTime } from 'react-intl';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import Breadcrumbs from 'modules/Breadcrumbs';
import { Button, DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class UserItem extends PureComponent {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    selectedUsers: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    deleteUsers: PropTypes.func.isRequired,
    unloadUsers: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
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
    const { fetchUsers, params } = this.props;
    fetchUsers(params.fqon);
  }

  componentWillUnmount() {
    const { unloadUsers, clearTableSelected, clearTableSort } = this.props;
    unloadUsers();
    clearTableSelected();
    clearTableSort();
  }

  handleRowToggle(row, toggled, count) {
    const { users, handleTableSelected, selectedUsers } = this.props;

    handleTableSelected(row, toggled, count, users, selectedUsers.selectedItems);
  }

  edit(user, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      this.props.router.push(`${this.props.params.fqon}/users/${user.id}/edit`);
    }
  }

  delete() {
    const { params, fetchUsers, deleteUsers, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedUsers;
    const userIds = selectedItems.map(item => (item.id));

    const userNames = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchUsers(params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteUsers(userIds, params.fqon, onSuccess);
    }, userNames);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-user"
        label="Create User"
        flat
        primary
        component={Link}
        to={`${this.props.params.fqon}/users/create`}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedUsers;
    const { handleTableSortIcon, sortTable } = this.props;

    const users = this.props.users.map(user => (
      <TableRow key={user.id} onClick={e => this.edit(user, e)}>
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
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={
              <div>
                <div className="gf-headline">Users</div>
                <div className="md-caption"><Breadcrumbs /></div>
              </div>
            }
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} user${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={() => this.delete()} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="users-progress" /> : null}
          <DataTable baseId="Users" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.users.length ? null :
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
        </Card>
      </div>
    );
  }
}

export default UserItem;

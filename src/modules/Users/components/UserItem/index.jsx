import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedDate } from 'react-intl';
import Card from 'react-md/lib/Cards/Card';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import TableSortColumn from 'components/TableSortColumn';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons/Button';
import FontIcon from 'react-md/lib/FontIcons';

class UserItem extends Component {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    handleSelected: PropTypes.func.isRequired,
    selectedUsers: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    deleteUsers: PropTypes.func.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const fqon = this.props.fqon || this.props.router.params.fqon;
    this.props.fetchUsers(fqon);
  }

  componentWillUnmount() {
    this.props.onUnloadListing();
  }

  handleRowToggle(row, toggled, count) {
    const { users, handleSelected, selectedUsers } = this.props;

    handleSelected(row, toggled, count, users, selectedUsers.selectedItems);
  }

  edit(user, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      this.props.router.push(`${this.props.params.fqon}/users/${user.id}/edit`);
    }
  }

  delete() {
    const { params, deleteUsers } = this.props;
    const { selectedItems } = this.props.selectedUsers;
    const userIds = selectedItems.map(item => (item.id));

    deleteUsers(userIds, params.fqon);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-user"
        label="Create User"
        flat
        component={Link}
        to={`${this.props.params.fqon}/users/create`}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedUsers;

    const users = this.props.users.map(user => (
      <TableRow key={user.id} onClick={e => this.edit(user, e)}>
        <TableColumn>{user.name}</TableColumn>
        <TableColumn>{user.description}</TableColumn>
        <TableColumn>{user.properties.firstName}</TableColumn>
        <TableColumn>{user.properties.lastName}</TableColumn>
        <TableColumn>{user.properties.phoneNumber}</TableColumn>
        <TableColumn>{user.properties.email}</TableColumn>
        <TableColumn><FormattedDate value={user.created.timestamp} /></TableColumn>
        <TableColumn>{user.properties.gestalt_home}</TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="Users"
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} user${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<Button onClick={() => this.delete()} style={{ color: 'red' }} icon>delete</Button>]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="users-progress" /> :
          <DataTable baseId="Users" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.users.length ? null :
            <TableHeader>
              <TableRow>
                <TableSortColumn list={this.props.users} name="Name" sortBy="name" />
                <TableColumn>Description</TableColumn>
                <TableColumn>First Name</TableColumn>
                <TableColumn>Last Name</TableColumn>
                <TableColumn>Phone Number</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Created</TableColumn>
                <TableColumn>Home</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {users}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default UserItem;

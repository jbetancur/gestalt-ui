import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import UserItem from '../../components/UserItem';
import actions from '../../actions';

class UserListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    selectedUsers: PropTypes.object.isRequired,
    deleteUsers: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    unloadUsers: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    usersPending: PropTypes.bool.isRequired,
  };

  constructor() {
    super();

    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const { fetchUsers, match } = this.props;
    fetchUsers(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadUsers, clearTableSelected, clearTableSort } = this.props;
    unloadUsers();
    clearTableSelected();
    clearTableSort();
  }

  edit(user, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      this.props.history.push(`/${this.props.match.params.fqon}/hierarchy/users/${user.id}/edit`);
    }
  }

  delete() {
    const { match, fetchUsers, deleteUsers, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedUsers;
    const userIds = selectedItems.map(item => (item.id));

    const userNames = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchUsers(match.params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteUsers(userIds, match.params.fqon, onSuccess);
    }, userNames);
  }

  render() {
    return (
      <UserItem
        model={this.props.users}
        pending={this.props.usersPending}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedUsers: state.tableManager.tableSelected,
    users: orderBy(state.metaResource.users.users, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(withContext(UserListing)));

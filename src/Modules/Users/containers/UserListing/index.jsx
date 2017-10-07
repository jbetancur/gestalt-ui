import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import { withTableManager } from 'Modules/TableManager';
import UserItem from '../../components/UserItem';
import actions from '../../actions';

class UserListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deleteUsers: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    unloadUsers: PropTypes.func.isRequired,
    usersPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { fetchUsers, match } = this.props;

    fetchUsers(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadUsers } = this.props;

    unloadUsers();
  }

  edit = (user, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      this.props.history.push(`/${this.props.match.params.fqon}/hierarchy/users/${user.id}/edit`);
    }
  }

  delete = () => {
    const { match, fetchUsers, deleteUsers, tableActions } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const userIds = items.map(item => (item.id));
    const userNames = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
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

export default withMetaResource(connect(null, { ...actions })(withContext(withTableManager(UserListing))));

import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import UserItem from '../../components/UserItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    users: sortBy(state.users.fetchAll.users, 'name'),
    pending: state.users.fetchAll.pending,
    selectedUsers: state.users.selectedUsers
  };
}

export default connect(mapStateToProps, actions)(UserItem);

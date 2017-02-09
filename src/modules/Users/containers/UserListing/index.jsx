import { connect } from 'react-redux';
import UserItem from '../../components/UserItem';

import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    users: state.users.fetchAll.users,
    pending: state.users.fetchAll.pending,
    selectedUsers: state.users.selectedUsers
  };
}

export default connect(mapStateToProps, actions)(UserItem);

import { connect } from 'react-redux';
import UserItem from '../../components/UserItem';

import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    users: state.users.fetchAll.items,
    pending: state.users.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(UserItem);

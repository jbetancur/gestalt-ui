import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import UserItem from '../../components/UserItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    users: sortBy(state.metaResource.users.users, 'name'),
    pending: state.metaResource.users.pending,
    selectedUsers: state.users.selectedUsers
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(UserItem);

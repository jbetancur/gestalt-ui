import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import UserItem from '../../components/UserItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    selectedUsers: state.tableManager.tableSelected,
    users: orderBy(state.metaResource.users.users, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.users.pending,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(UserItem);

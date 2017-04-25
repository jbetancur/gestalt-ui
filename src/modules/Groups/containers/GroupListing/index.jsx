import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import GroupItem from '../../components/GroupItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    selectedGroups: state.tableManager.tableSelected,
    groups: orderBy(state.metaResource.groups.groups, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.groups.pending,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(GroupItem);

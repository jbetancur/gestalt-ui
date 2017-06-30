import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import GroupItem from '../../components/GroupItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    selectedGroups: state.tableManager.tableSelected,
    groups: orderBy(state.metaResource.groups.groups, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(context(GroupItem)));

import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import { context } from 'modules/ContextManagement';
import { tableActions } from 'modules/TableManager';
import APIItem from '../../components/APIItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    apis: orderBy(state.metaResource.apis.apis, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.apis.pending,
    selectedAPIs: state.tableManager.tableSelected,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(context(APIItem));

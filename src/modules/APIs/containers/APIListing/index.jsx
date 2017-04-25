import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import APIItem from '../../components/APIItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    apis: orderBy(state.metaResource.apis.apis, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.apis.pending,
    selectedAPIs: state.tableManager.tableSelected,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(APIItem);

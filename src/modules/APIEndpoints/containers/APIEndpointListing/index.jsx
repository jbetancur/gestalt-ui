import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import APIEndpointItem from '../../components/APIEndpointItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    apiEndpoints: orderBy(state.metaResource.apiEndpoints.apiEndpoints, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.apiEndpoints.pending,
    selectedEndpoints: state.tableManager.tableSelected,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(APIEndpointItem);

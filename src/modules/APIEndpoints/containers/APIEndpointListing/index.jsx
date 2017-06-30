import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import APIEndpointItem from '../../components/APIEndpointItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    apiEndpoints: orderBy(state.metaResource.apiEndpoints.apiEndpoints, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedEndpoints: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(context(APIEndpointItem)));

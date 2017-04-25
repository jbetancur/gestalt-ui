import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import ContainerItem from '../../components/ContainerItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    containers: orderBy(state.metaResource.containers.containers, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.containers.pending,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(ContainerItem);

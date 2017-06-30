import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import ContainerItem from '../../components/ContainerItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    containers: orderBy(state.metaResource.containers.containers, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(context(ContainerItem)));

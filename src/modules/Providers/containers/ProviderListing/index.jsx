import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import ProviderItem from '../../components/ProviderItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    providers: orderBy(state.metaResource.providers.providers, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.providers.pending,
    selectedProviders: state.tableManager.tableSelected,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(ProviderItem);

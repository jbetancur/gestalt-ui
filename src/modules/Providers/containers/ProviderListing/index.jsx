import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import ProviderItem from '../../components/ProviderItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    providers: orderBy(state.metaResource.providers.providers, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedProviders: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(context(ProviderItem)));

import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import PolicyItem from '../../components/PolicyItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    policies: orderBy(state.metaResource.policies.policies, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.policies.pending,
    selectedPolicies: state.tableManager.tableSelected,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(context(PolicyItem));

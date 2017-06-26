import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import PolicyRuleItem from '../../components/PolicyRuleItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    policyRules: orderBy(state.metaResource.policyRules.policyRules, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.policyRules.pending,
    selectedPolicyRules: state.tableManager.tableSelected,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(context(PolicyRuleItem));

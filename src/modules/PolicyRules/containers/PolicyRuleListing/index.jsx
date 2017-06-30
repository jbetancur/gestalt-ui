import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import PolicyRuleItem from '../../components/PolicyRuleItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    policyRules: orderBy(state.metaResource.policyRules.policyRules, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedPolicyRules: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(context(PolicyRuleItem)));

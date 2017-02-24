import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import PolicyRuleItem from '../../components/PolicyRuleItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    policyRules: sortBy(state.policyRules.fetchAll.policyRules, 'name'),
    pending: state.policyRules.fetchAll.pending,
    selectedPolicyRules: state.policyRules.selectedPolicyRules,
  };
}

export default connect(mapStateToProps, actions)(PolicyRuleItem);

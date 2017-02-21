import { connect } from 'react-redux';
import PolicyRuleItem from '../../components/PolicyRuleItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    policyRules: state.policyRules.fetchAll.policyRules,
    pending: state.policyRules.fetchAll.pending,
    selectedPolicyRules: state.policyRules.selectedPolicyRules,
  };
}

export default connect(mapStateToProps, actions)(PolicyRuleItem);

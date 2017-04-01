import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import PolicyRuleItem from '../../components/PolicyRuleItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    policyRules: sortBy(state.metaResource.policyRules.policyRules, 'name'),
    pending: state.metaResource.policyRules.pending,
    selectedPolicyRules: state.policyRules.selectedPolicyRules,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(PolicyRuleItem);

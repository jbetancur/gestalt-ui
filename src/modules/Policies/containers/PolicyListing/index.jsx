import { connect } from 'react-redux';
import PolicyItem from '../../components/PolicyItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    policies: state.policies.fetchAll.policies,
    pending: state.policies.fetchAll.pending,
    selectedPolicies: state.policies.selectedPolicies,
  };
}

export default connect(mapStateToProps, actions)(PolicyItem);

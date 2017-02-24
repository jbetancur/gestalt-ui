import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import PolicyItem from '../../components/PolicyItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    policies: sortBy(state.policies.fetchAll.policies, 'name'),
    pending: state.policies.fetchAll.pending,
    selectedPolicies: state.policies.selectedPolicies,
  };
}

export default connect(mapStateToProps, actions)(PolicyItem);

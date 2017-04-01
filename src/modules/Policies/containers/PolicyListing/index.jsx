import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import PolicyItem from '../../components/PolicyItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    policies: sortBy(state.metaResource.policies.policies, 'name'),
    pending: state.metaResource.policies.pending,
    selectedPolicies: state.policies.selectedPolicies,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(PolicyItem);

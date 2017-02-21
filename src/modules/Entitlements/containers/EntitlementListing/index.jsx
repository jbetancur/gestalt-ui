import { connect } from 'react-redux';
import EntitlementItem from '../../components/EntitlementItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    entitlements: state.entitlements.fetchAll.items,
    pending: state.entitlements.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(EntitlementItem);

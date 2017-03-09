import { connect } from 'react-redux';
import EntitlementItem from '../../components/EntitlementItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    self: state.app.self.self,
    entitlements: state.entitlements.fetchAll.entitlements,
    pendingEntitlements: state.entitlements.fetchAll.pending,
    selectedIdentity: state.entitlements.selectedIdentity.identity,
    identities: state.entitlements.identities.identities,
    pendingIdentities: state.entitlements.identities.pending,
    pendingUpdateEntitlements: state.entitlements.entitlementUpdate.pending,
  };
}

export default connect(mapStateToProps, actions)(EntitlementItem);

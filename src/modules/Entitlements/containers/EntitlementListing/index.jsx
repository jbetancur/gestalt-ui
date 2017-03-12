import { connect } from 'react-redux';
import EntitlementItem from '../../components/EntitlementItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    self: state.app.self.self,
    entitlements: state.entitlements.fetchAll.entitlements,
    pendingEntitlements: state.entitlements.fetchAll.pending,
    selectedIdentity: state.entitlements.selectedIdentity.identity,
    identities: state.entitlements.identities.identities.filter(val => val.name.includes(state.entitlements.identitiesFilter.filterText)),
    pendingIdentities: state.entitlements.identities.pending,
    pendingUpdateEntitlements: state.entitlements.entitlementUpdate.pending,
    identitiesFilter: state.entitlements.identitiesFilter,
  };
}

export default connect(mapStateToProps, actions)(EntitlementItem);

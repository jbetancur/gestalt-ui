import { connect } from 'react-redux';
import { metaActions } from 'modules/MetaResource';
import EntitlementItem from '../../components/EntitlementItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    self: state.metaResource.self.self,
    entitlements: state.metaResource.entitlements.entitlements,
    pendingEntitlements: state.metaResource.entitlements.pending,
    selectedIdentity: state.metaResource.entitlementSelectedIdentity.identity,
    identities: state.metaResource.entitlementIdentities.identities.filter(val => val.name.includes(state.entitlements.identitiesFilter.filterText)),
    pendingIdentities: state.metaResource.entitlementIdentities.pending,
    pendingUpdateEntitlements: state.metaResource.entitlementUpdate.pending,
    identitiesFilter: state.entitlements.identitiesFilter,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(EntitlementItem);

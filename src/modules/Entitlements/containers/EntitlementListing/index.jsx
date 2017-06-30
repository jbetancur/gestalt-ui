import { connect } from 'react-redux';
import { withMetaResource } from 'modules/MetaResource';
import EntitlementItem from '../../components/EntitlementItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    identities: state.metaResource.entitlementIdentities.identities.filter(val => val.name.includes(state.entitlements.identitiesFilter.filterText)),
    identitiesFilter: state.entitlements.identitiesFilter,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(EntitlementItem));

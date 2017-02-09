import { connect } from 'react-redux';
import OrgItem from '../../components/OrgItem';

import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    self: state.app.self.self,
    pending: state.organizations.fetchSet.pending,
    organization: state.organizations.fetchSet.organization,
    organizations: state.organizations.fetchSet.organizations,
    currentOrgPending: state.organizations.fetchOne.pending
  };
}

export default connect(mapStateToProps, actions)(OrgItem);

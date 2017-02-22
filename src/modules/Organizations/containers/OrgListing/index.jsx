import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appActions } from 'App';
import OrgItem from '../../components/OrgItem';
import * as actions from '../../actions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, appActions), dispatch);
}

function mapStateToProps(state) {
  return {
    self: state.app.self.self,
    pending: state.organizations.fetchSet.pending,
    organization: state.organizations.fetchSet.organization,
    organizations: state.organizations.fetchSet.organizations,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgItem);

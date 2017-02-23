import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appActions } from 'App';
import EnvironmentDetail from '../../components/EnvironmentDetail';
import * as actions from '../../actions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, appActions), dispatch);
}

function mapStateToProps(state) {
  return {
    environment: state.environments.fetchOne.environment,
    workspace: state.workspaces.fetchOne.workspace,
    pending: state.environments.fetchOne.pending,
    navigation: state.environments.navigation
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentDetail);

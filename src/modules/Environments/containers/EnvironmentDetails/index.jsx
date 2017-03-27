import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import EnvironmentDetail from '../../components/EnvironmentDetail';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    environment: state.environments.fetchOne.environment,
    workspace: state.workspaces.fetchOne.workspace,
    pending: state.environments.fetchOne.pending,
    navigation: state.environments.navigation
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(EnvironmentDetail);

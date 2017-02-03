import { connect } from 'react-redux';
import EnvironmentDetail from '../../components/EnvironmentDetail';

import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    environment: state.environments.fetchOne.item,
    workspace: state.workspaces.fetchOne.workspace,
    pending: state.environments.fetchOne.pending,
    navigation: state.environments.navigation
  };
}

export default connect(mapStateToProps, actions)(EnvironmentDetail);

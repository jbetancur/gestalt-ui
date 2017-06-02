import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import EnvironmentContext from '../../components/EnvironmentContext';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    environment: state.metaResource.environment.environment,
    workspace: state.metaResource.workspace.workspace,
    pending: state.metaResource.environment.pending,
    navigation: state.hierarchy.environmentContextNavigation,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(EnvironmentContext);

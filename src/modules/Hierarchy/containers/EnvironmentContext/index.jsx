import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import { context } from 'modules/ContextManagement';
import EnvironmentContext from '../../components/EnvironmentContext';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    environment: state.metaResource.environment.environment,
    workspace: state.metaResource.workspace.workspace,
    pending: state.metaResource.environment.pending,
    navigation: state.hierarchy.environmentContextNavigation,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(context(EnvironmentContext));

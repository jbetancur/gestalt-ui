import { connect } from 'react-redux';
import { appActions } from 'App';
import { withMetaResource } from 'modules/MetaResource';
import { context } from 'modules/ContextManagement';
import EnvironmentContext from '../../components/EnvironmentContext';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    navigation: state.hierarchy.environmentContextNavigation,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, appActions))(context(EnvironmentContext)));

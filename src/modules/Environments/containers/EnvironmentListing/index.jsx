import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appActions } from 'App';
import EnvironmentItem from '../../components/EnvironmentItem';
import * as actions from '../../actions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, appActions), dispatch);
}

function mapStateToProps(state) {
  return {
    environments: state.environments.fetchAll.environments,
    pending: state.environments.fetchAll.pending
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentItem);

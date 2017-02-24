import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appActions } from 'App';
import { sortBy } from 'lodash';
import EnvironmentItem from '../../components/EnvironmentItem';
import * as actions from '../../actions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, appActions), dispatch);
}

function mapStateToProps(state) {
  return {
    environments: sortBy(state.environments.fetchAll.environments, ['environment_type', 'name']),
    pending: state.environments.fetchAll.pending
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentItem);

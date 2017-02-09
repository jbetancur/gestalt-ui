import { connect } from 'react-redux';
import EnvironmentItem from '../../components/EnvironmentItem';

import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    environments: state.environments.fetchAll.environments,
    pending: state.environments.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(EnvironmentItem);

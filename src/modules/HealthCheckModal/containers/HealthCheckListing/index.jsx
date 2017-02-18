import { connect } from 'react-redux';
import HealthCheckListing from '../../components/HealthCheckListing';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    healthCheckModal: state.healthCheckModal.healthCheckModal,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
  };
}

export default connect(mapStateToProps, actions)(HealthCheckListing);

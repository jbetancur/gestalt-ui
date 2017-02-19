import { connect } from 'react-redux';
import NetworkListing from '../../components/NetworkListing';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    networkModal: state.networkModal.networkModal,
    networks: state.networkModal.networks.networks,
  };
}

export default connect(mapStateToProps, actions)(NetworkListing);

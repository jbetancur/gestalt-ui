import { connect } from 'react-redux';
import PortMapListing from '../../components/PortMapListing';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    portmapModal: state.portmapModal.portmapModal,
    portMappings: state.portmapModal.portMappings.portMappings,
  };
}

export default connect(mapStateToProps, actions)(PortMapListing);

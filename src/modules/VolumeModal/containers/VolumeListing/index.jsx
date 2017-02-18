import { connect } from 'react-redux';
import VolumeListing from '../../components/VolumeListing';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    volumeModal: state.volumeModal.volumeModal,
    volumes: state.volumeModal.volumes.volumes,
  };
}

export default connect(mapStateToProps, actions)(VolumeListing);

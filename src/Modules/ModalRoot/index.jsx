import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// These are regular React components we will write soon
import { EntitlementModal } from 'Modules/Entitlements';
import { APIEndpointWizardModal } from 'Modules/APIEndpoints';
import { StreamInstanceModal } from 'Modules/Streams';
import { ContainerImportModal } from 'Modules/Containers';
import { VolumeCreateModal } from 'Modules/Volumes';
import LicenseModal from 'Modules/Licensing';
import CONFIRM from './Modals/ConfirmModal';
import IFRAME from './Modals/IFrameModal';

const MODAL_COMPONENTS = {
  CONFIRM,
  IFRAME,
  EntitlementModal,
  LicenseModal,
  APIEndpointWizardModal,
  StreamInstanceModal,
  ContainerImportModal,
  VolumeCreateModal,
  /* other modals */
};

class ModalRoot extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
  };

  state = {
    modalVisible: this.props.modal.visible,
  };

  componentDidUpdate(prevProps) {
    const { modal } = this.props;

    /*
     We use setstate here to force the component to unmount within 300ms to prevent animations from breaking,
     and to make sure the modal is fully destroyed
    */
    if (prevProps.modal.visible !== modal.visible && modal.visible) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ modalVisible: modal.visible });
    }

    if (prevProps.modal.visible !== modal.visible && !modal.visible) {
      // eslint-disable-next-line react/no-did-update-set-state
      setTimeout(() => this.setState({ modalVisible: modal.visible }), 300);
    }
  }

  render() {
    const { modal } = this.props;
    const { modalVisible } = this.state;

    if (!modal.modalType || !modalVisible) {
      return null;
    }

    const SpecificModal = MODAL_COMPONENTS[modal.modalType];
    return <SpecificModal visible={modal.visible} {...modal.modalProps} />;
  }
}

const mapStateToProps = ({ modal }) => ({
  modal,
});

export default connect(mapStateToProps)(ModalRoot);

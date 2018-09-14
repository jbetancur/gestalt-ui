import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// These are regular React components we will write soon
import { EntitlementModal } from 'Modules/Entitlements';
import { APIEndpointWizardModal } from 'Modules/APIEndpoints';
import { StreamInstanceModal } from 'Modules/Streams';
import { ContainerImportModal } from 'Modules/Containers';
import { VolumeCreateModal } from 'Modules/Volumes';
import LicenseModal from 'Modules/Licensing';
import CONFIRM from './Modals/ConfirmDelete';
import REPARENTUSER from './Modals/ReparentUser';
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
  REPARENTUSER,
  /* other modals */
};

const ModalRoot = ({ modal }) => {
  if (!modal.modalType) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[modal.modalType];
  return <SpecificModal {...modal.modalProps} />;
};

ModalRoot.propTypes = {
  modal: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  modal: state.modal,
});

export default connect(mapStateToProps)(ModalRoot);

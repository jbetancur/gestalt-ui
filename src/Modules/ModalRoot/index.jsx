import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// These are regular React components we will write soon
import { EntitlementModal } from 'Modules/Entitlements';
import { APIEndpointWizardModal } from 'Modules/APIEndpoints';
import { StreamInstanceModal } from 'Modules/Streams';
import LicenseModal from 'Modules/Licensing';
import CONFIRM from './Modals/Confirm';
import IFRAME from './Modals/IFrameModal';

const MODAL_COMPONENTS = {
  CONFIRM,
  IFRAME,
  EntitlementModal,
  LicenseModal,
  APIEndpointWizardModal,
  StreamInstanceModal
  /* other modals */
};

const ModalRoot = (props) => {
  if (!props.modal.modalType) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[props.modal.modalType];
  return <SpecificModal {...props.modal.modalProps} />;
};

ModalRoot.propTypes = {
  modal: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps)(ModalRoot);

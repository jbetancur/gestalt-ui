import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// These are regular React components we will write soon
import ConfirmModal from './Modals/Confirm';

const MODAL_COMPONENTS = {
  CONFIRM: ConfirmModal,
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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SCALE from './Modals/Scale';
import MIGRATE from './Modals/Migrate';

const MODAL_COMPONENTS = {
  SCALE,
  MIGRATE,
  /* other modals */
};

const ModalRoot = (props) => {
  if (!props.actionsModal.modalType) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[props.actionsModal.modalType];
  return <SpecificModal {...props.actionsModal.modalProps} />;
};

ModalRoot.propTypes = {
  actionsModal: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    actionsModal: state.containers.actionsModals,
  };
}

export default connect(mapStateToProps)(ModalRoot);

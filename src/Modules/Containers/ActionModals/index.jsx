import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SCALE from './Modals/Scale';
import MIGRATE from './Modals/Migrate';
import PROMOTE from './Modals/Promote';

const MODAL_COMPONENTS = {
  SCALE,
  MIGRATE,
  PROMOTE,
  /* other modals */
};

const ModalRoot = ({ actionsModal }) => {
  if (!actionsModal.modalType) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[actionsModal.modalType];
  return <SpecificModal visible={actionsModal.visible} {...actionsModal.modalProps} />;
};

ModalRoot.propTypes = {
  actionsModal: PropTypes.object.isRequired,
};

const mapStateToProps = ({ containers }) => ({
  actionsModal: containers.actionsModals,
});

export default connect(mapStateToProps)(ModalRoot);

import React, { useContext } from 'react';
import { ModalContext } from './ModalContext';

const ModalRoot = () => {
  const { component, open, props, hideModal, destroyModal } = useContext(ModalContext);
  const Component = component;

  const modal = {
    hideModal,
    destroyModal,
    open,
  };

  return (
    component ? <Component {...props} modal={modal} /> : null
  );
};

export default ModalRoot;

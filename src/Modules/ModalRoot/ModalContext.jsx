import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ModalContext = createContext({
  component: null,
  open: false,
  props: {},
  showModal: () => { },
  hideModal: () => { },
});

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    component: null,
    open: false,
    props: {},
  });

  const showModal = (component, props = {}) => {
    setModal({
      component,
      open: true,
      props: {
        ...props,
      },
    });
  };

  const hideModal = () =>
    setModal({
      // keep the state until we destroy onExit
      component: modal.component,
      open: false,
      props: {
        ...modal.props,
      },
    });

  const destroyModal = () =>
    // remove all state
    setModal({
      component: null,
      open: false,
      props: {},
    });

  const initState = {
    ...modal,
    showModal,
    hideModal,
    destroyModal,
  };

  return (
    <ModalContext.Provider value={initState}>
      {children}
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export const ModalConsumer = ModalContext.Consumer;

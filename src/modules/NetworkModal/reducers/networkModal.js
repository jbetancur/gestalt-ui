import {
  SHOW_NETWORK_MODAL,
  HIDE_NETWORK_MODAL,
} from '../actionTypes';

const initialState = {
  visible: false,
  modalType: null,
  modalProps: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NETWORK_MODAL:
      return {
        visible: true,
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case HIDE_NETWORK_MODAL:
      return initialState;
    default:
      return state;
  }
};

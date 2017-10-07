import {
  SHOW_PORTMAP_MODAL,
  HIDE_PORTMAP_MODAL,
} from '../actionTypes';

const initialState = {
  visible: false,
  modalType: null,
  modalProps: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PORTMAP_MODAL:
      return {
        visible: true,
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case HIDE_PORTMAP_MODAL:
      return initialState;
    default:
      return state;
  }
};

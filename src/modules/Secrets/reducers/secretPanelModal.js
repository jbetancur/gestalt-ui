import {
  SHOW_SECRET_MODAL,
  HIDE_SECRET_MODAL,
} from '../actionTypes';

const initialState = {
  visible: false,
  modalType: null,
  modalProps: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SECRET_MODAL:
      return {
        visible: true,
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case HIDE_SECRET_MODAL:
      return initialState;
    default:
      return state;
  }
};

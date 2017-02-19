import {
  SHOW_VOLUME_MODAL,
  HIDE_VOLUME_MODAL,
} from '../actionTypes';

const initialState = {
  visible: false,
  modalType: null,
  modalProps: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_VOLUME_MODAL:
      return {
        visible: true,
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case HIDE_VOLUME_MODAL:
      return initialState;
    default:
      return state;
  }
};

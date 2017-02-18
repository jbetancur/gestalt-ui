import {
  SHOW_HEALTH_CHECK_MODAL,
  HIDE_HEALTH_CHECK_MODAL,
} from '../actionTypes';

const initialState = {
  visible: false,
  modalType: null,
  modalProps: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_HEALTH_CHECK_MODAL:
      return {
        visible: true,
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case HIDE_HEALTH_CHECK_MODAL:
      return initialState;
    default:
      return state;
  }
};

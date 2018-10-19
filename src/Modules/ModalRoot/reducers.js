const initialState = {
  visible: false,
  modalType: null,
  modalProps: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        visible: true,
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case 'HIDE_MODAL':
      // we do not want to clear out all the state otherwise it breaks animations
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
};

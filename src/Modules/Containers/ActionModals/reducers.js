const initialState = {
  visible: false,
  modalType: null,
  modalProps: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_CONTAINER_MODAL':
      return {
        visible: true,
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case 'HIDE_CONTAINER_MODAL':
      return initialState;
    default:
      return state;
  }
};

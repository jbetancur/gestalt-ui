const initialState = {
  visible: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_LOGIN_MODAL':
      return {
        visible: true,
      };
    case 'HIDE_LOGIN_MODAL':
      return initialState;
    default:
      return state;
  }
};

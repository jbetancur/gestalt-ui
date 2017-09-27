const initialState = {
  count: 0,
  showTitle: true,
  items: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'tableManager/CLEAR_SELECTED_ROWS':
      return initialState;
    case 'tableManager/SELECTED_ROWS':
      return {
        ...state,
        count: action.payload.count,
        showTitle: action.payload.showTitle,
        items: action.payload.items,
      };
    default:
      return state;
  }
};

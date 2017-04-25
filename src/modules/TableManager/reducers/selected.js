const initialState = {
  selectedCount: 0,
  showTitle: true,
  selectedItems: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'tableManager/CLEAR_SELECTED_ROWS':
      return initialState;
    case 'tableManager/SELECTED_ROWS':
      return {
        ...state,
        selectedCount: action.payload.selectedCount,
        showTitle: action.payload.showTitle,
        selectedItems: action.payload.selectedItems,
      };
    default:
      return state;
  }
};

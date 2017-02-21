import {
  SELECTED_GROUPS,
  SELECTED_GROUPS_CLEAR,
} from '../actionTypes';

const initialState = {
  selectedCount: 0,
  showTitle: true,
  selectedItems: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECTED_GROUPS_CLEAR:
      return initialState;
    case SELECTED_GROUPS:
      return {
        ...state,
        selectedCount: action.payload.selectedCount,
        showTitle: action.payload.showTitle,
        selectedItems: action.payload.selectedItems
      };
    default:
      return state;
  }
};

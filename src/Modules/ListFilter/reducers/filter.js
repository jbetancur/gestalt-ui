const initialState = {
  filter: 'SHOW_ALL',
  filterText: '',
  isFiltering: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return {
        ...state,
        filter: action.filter,
        filterText: action.filterText,
        isFiltering: !!action.filterText || action.filter !== 'SHOW_ALL',
      };
    case 'CLEAR_VISIBILITY_FILTERTEXT':
      return {
        ...state,
        filterText: ''
      };
    default:
      return state;
  }
};

const initialState = {
  key: '',
  order: 'asc',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'tableManager/CLEAR_SORT':
      return initialState;
    case 'tableManager/SORT_COLUMN':
      return {
        ...state,
        key: action.key,
        order: state.order === 'asc' ? 'desc' : 'asc',
      };
    default:
      return state;
  }
};

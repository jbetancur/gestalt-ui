import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  CLEAR_OLDEST_MESSAGE,
} from './actionTypes';

let id = 0;

const initialState = {
  queue: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        // eslint-disable-next-line no-plusplus
        queue: [...state.queue, { id: id++, ...action.message }],
      };
    case CLEAR_OLDEST_MESSAGE:
      return {
        ...state,
        queue: [...state.queue.slice(1)],
      };
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        queue: state.queue.filter(item => item.id !== action.message.id),
      };
    default:
      return state;
  }
};

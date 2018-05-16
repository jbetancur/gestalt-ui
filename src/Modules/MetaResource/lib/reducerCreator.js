import { insertItem, removeItemById } from 'util/helpers/lists';
import { PREFIX } from '../actionTypes';

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    // eslint-disable-next-line no-prototype-builtins
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}

const initialState = model => ({
  pending: false,
  completed: false,
  error: null,
  items: [],
  item: model,
});

export const fetchTemplate = (name, model) => createReducer(initialState(model), {
  [`${PREFIX}FETCH_${name}_REQUEST`]: state => ({
    ...state,
    pending: true,
  }),
  [`${PREFIX}FETCH_${name}_SUCCESS_ITEMS`]: (state, action) => ({
    ...state,
    pending: false,
    completed: true,
    items: action.payload,
  }),
  [`${PREFIX}FETCH_${name}_SUCCESS_ITEM`]: (state, action) => ({
    ...state,
    pending: false,
    completed: true,
    item: action.payload,
  }),
  [`${PREFIX}FETCH_${name}_ERROR`]: (state, action) => ({
    ...state,
    pending: false,
    error: action.payload,
  })
});

export const createTemplate = () => createReducer(initialState, {
  REQUEST: state => ({
    ...state,
    pending: true,
  }),
  SUCCESS: (state, action) => ({
    ...state,
    pending: false,
    completed: true,
    items: insertItem(state.items, action.payload)
  }),
  SUCCESS_item: (state, action) => ({
    ...state,
    pending: false,
    completed: true,
    item: action.payload,
  }),
  ERROR: (state, action) => ({
    ...state,
    pending: false,
    error: action.payload,
  })
});

export const updateTemplate = () => createReducer(initialState, {
  REQUEST: state => ({
    ...state,
    pending: true,
  }),
  SUCCESS: (state, action) => ({
    ...state,
    pending: false,
    completed: true,
    items: action.payload,
  }),
  SUCCESS_item: (state, action) => ({
    ...state,
    pending: false,
    completed: true,
    item: action.payload,
  }),
  ERROR: (state, action) => ({
    ...state,
    pending: false,
    error: action.payload,
  })
});

export const deleteTemplate = () => createReducer(initialState, {
  REQUEST: state => ({
    ...state,
    pending: true,
  }),
  SUCCESS: (state, action) => ({
    ...state,
    pending: false,
    completed: true,
    items: removeItemById(state.items, action.payload),
  }),
  SUCCESS_item: (state, action) => ({
    ...state,
    pending: false,
    completed: true,
    item: action.payload,
  }),
  ERROR: (state, action) => ({
    ...state,
    pending: false,
    error: action.payload,
  })
});


const test = {
  apiEndpoints: [fetchTemplate({})]
};

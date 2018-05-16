import { insertItem, removeItemById } from 'util/helpers/lists';
import { PREFIX } from '../actionTypes';

/**
 * Creates Async API Reducers so we don't have to...
 * @param {Array} verbs - an array of actions (will generate a request, fulfilled and rejected reducer set). this is also the prefix (FETCH_...)
 * @param {string} key - the key, usually the name of your model
 * @param {string} category - the category to be included in the dispatch type (FETCH_SOMETHING_...)
 * @param {*} model - an {} or an []
 */
export default function createAsyncReducer(verbs = [], key, category, model) {
  const categoryUpper = category.toUpperCase();
  const initialState = {
    pending: false,
    completed: false,
    error: null,
    [key]: model,
  };

  return (state = initialState, action) => {
    const actions = {};

    verbs.forEach((verb) => {
      const verbUpper = verb.toUpperCase();
      Object.assign(actions, {
        [`${PREFIX}${verbUpper}_${categoryUpper}_REQUEST`]: () => {
          const payload = {
            ...state,
            // eslint-disable-next-line no-unneeded-ternary
            pending: action.isPolling ? false : true, // TODO: polling will be removed when we have SSE,
          };

          return payload;
        },
        [`${PREFIX}${verbUpper}_${categoryUpper}_FULFILLED`]: () => {
          const payload = {
            ...state,
            pending: false,
            completed: true,
          };

          if (verb !== 'delete') {
            Object.assign(payload, { [key]: action.payload });
          }

          if (Array.isArray(state[key]) && Array.isArray(model)) {
            if (verb === 'delete') {
              Object.assign(payload, {
                [key]: removeItemById(state[key], action.payload)
              });
            }

            if (verb === 'create') {
              Object.assign(payload, {
                [key]: insertItem(state[key], action.payload)
              });
            }
          }

          return payload;
        },
        [`${PREFIX}${verbUpper}_${categoryUpper}_REJECTED`]: () => (
          {
            ...state,
            pending: false,
            error: action.payload,
          }
        ),
      });
    });

    Object.assign(actions, {
      [`${PREFIX}UNLOAD_${categoryUpper}`]: () => initialState,
      default: () => state,
    });

    return (actions[action.type] || actions.default)();
  };
}

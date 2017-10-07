import { LOCATION_CHANGE } from 'react-router-redux';

/**
 * Creates Async API Reducers so we don't have to...
 * @param {Array} verbs - an array of actions (will generate a request, fulfilled and rejected reducer set). this is also the prefix (FETCH_...)
 * @param {string} key - the key, usually the name of your model
 * @param {string} category - the category to be included in the dispatch type (FETCH_SOMETIME_...)
 * @param {*} model - an Object or an []
 * @param {boolean} clearStateOnRouteChange - whether to clear the state on redux-router change
 * @param {*} customRequestState - optional placeholder to populate whn in a REQUEST state
 */
export default function createAsyncReducer(verbs, key, category, model, clearStateOnRouteChange = false, customRequestState) {
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
        [`metaResource/${verbUpper}_${categoryUpper}_REQUEST`]: () => {
          const payload = {
            ...state,
            // eslint-disable-next-line no-unneeded-ternary
            pending: action.isPolling ? false : true, // TODO: polling will be removed when we have SSE,
          };

          if (customRequestState) {
            Object.assign(payload, { [key]: customRequestState });
          }

          return payload;
        },
        [`metaResource/${verbUpper}_${categoryUpper}_FULFILLED`]: () => {
          const payload = {
            ...state,
            pending: false,
            completed: true,
          };

          if (verb !== 'delete') {
            Object.assign(payload, { [key]: action.payload });
          }

          return payload;
        },
        [`metaResource/${verbUpper}_${categoryUpper}_REJECTED`]: () => (
          {
            ...state,
            pending: false,
            error: action.payload,
          }
        ),
      });
    });

    if (clearStateOnRouteChange) {
      Object.assign(actions, { [LOCATION_CHANGE]: () => initialState });
    }

    Object.assign(actions, {
      [`metaResource/UNLOAD_${categoryUpper}`]: () => initialState,
      default: () => state,
    });

    return (actions[action.type] || actions.default)();
  };
}

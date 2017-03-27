import {
  FILTER_ALLORGS_TEXT,
  UNLOAD_ALLORGS,
} from './actionTypes';

export function onUnload() {
  return (dispatch) => {
    dispatch({ type: UNLOAD_ALLORGS });
  };
}

export function filterOrgs(predicate) {
  return (dispatch) => {
    dispatch({ type: FILTER_ALLORGS_TEXT, filterText: predicate });
  };
}

export default { filterOrgs };

import {
  FILTER_ALLORGS_TEXT,
} from './actionTypes';

export function filterOrgs(predicate) {
  return (dispatch) => {
    dispatch({ type: FILTER_ALLORGS_TEXT, filterText: predicate });
  };
}

export default { filterOrgs };

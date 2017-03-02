import axios from 'axios';
import { sortBy } from 'lodash';
import {
  FETCH_ENTITLEMENTS_PENDING,
  FETCH_ENTITLEMENTS_REJECTED,
  FETCH_ENTITLEMENTS_FULFILLED
} from './actionTypes';


export function fetchEntitlements(fqon, entityId, entityKey) {
  const url = entityId ? `/${fqon}/${entityKey}/${entityId}/entitlements` : `/${fqon}/entitlements`;

  return (dispatch) => {
    dispatch({ type: FETCH_ENTITLEMENTS_PENDING });
    axios.get(`${url}?expand=true`).then((response) => {
      dispatch({ type: FETCH_ENTITLEMENTS_FULFILLED, payload: sortBy(response.data, 'properties.action') });
    }).catch((err) => {
      dispatch({ type: FETCH_ENTITLEMENTS_REJECTED, payload: err });
    });
  };
}

export { fetchEntitlements as default };

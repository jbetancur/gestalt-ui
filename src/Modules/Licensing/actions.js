import axios from 'axios';
import moment from 'moment';
import {
  FETCH_LICENSE_PENDING,
  FETCH_LICENSE_FULFILLED,
  FETCH_LICENSE_REJECTED,
  UPDATE_LICENSE_PENDING,
  UPDATE_LICENSE_FULFILLED,
  UPDATE_LICENSE_REJECTED,
  LICENSE_UNLOADED,
  LICENSE_EXPIRING,
  LICENSE_EXPIRED,
} from './actionTypes';
import { LICENSE_EXP_THRESHOLD } from '../../constants';

function parseLicense(response) {
  // get the most recent license
  if (response.data.length > 0) {
    return response.data[response.data.length - 1];
  }
  return response.data;
}

/**
 * Unload the license from the state store
 */
export function unloadLicense() {
  return { type: LICENSE_UNLOADED };
}

/**
 * Fetches the licese from Meta API
 * @param {*} fqon
 */
export function fetchLicense(fqon) {
  return (dispatch) => {
    dispatch({ type: FETCH_LICENSE_PENDING });
    axios.get(`${fqon}/licenses?transform=true`).then((response) => {
      // TODO: Refactor - this is ugly
      const license = parseLicense(response);
      /* eslint no-restricted-syntax: 0 */
      for (const key in license) {
        if (key === 'notAfter') {
          const licExpDate = new Date(license[key]);
          const curDate = new Date();
          // If the expiration is within X days then let the user know they need to re-license
          licExpDate.setDate(licExpDate.getDate() - LICENSE_EXP_THRESHOLD);

          let expired;
          if (curDate > new Date(license[key])) {
            dispatch({ type: LICENSE_EXPIRED, payload: 'The Gestalt license has expired. Please request a new license' });
            expired = true;
          }

          if (curDate > licExpDate && !expired) {
            dispatch({ type: LICENSE_EXPIRING, payload: `The Gestalt license will expire ${moment(moment(license[key])).fromNow()}` });
          }
        }
      }

      dispatch({ type: FETCH_LICENSE_FULFILLED, payload: parseLicense(response) });
    }).catch((err) => {
      dispatch({ type: FETCH_LICENSE_REJECTED, payload: err });
    });
  };
}

/**
 *
 * @param {*} fqon
 * @param {*} payload
 * @param {*} cb - optional callback to trigger
 */
export function updateLicense(fqon, payload) {
  return (dispatch) => {
    dispatch({ type: UPDATE_LICENSE_PENDING });
    return axios.post(`${fqon}/licenses`, payload).then(() => {
      dispatch({ type: UPDATE_LICENSE_FULFILLED });
    }).catch((err) => {
      dispatch({ type: UPDATE_LICENSE_REJECTED, payload: err });
    });
  };
}

/**
 * showLicenseModal
 */
export function showLicenseModal() {
  return {
    type: 'SHOW_MODAL',
    modalType: 'LicenseModal',
  };
}

export function hideLicenseModal() {
  return { type: 'HIDE_MODAL' };
}

export default {
  unloadLicense,
  fetchLicense,
  updateLicense,
  showLicenseModal,
  hideLicenseModal,
};

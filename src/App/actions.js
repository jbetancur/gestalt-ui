import { SHOW_EXPERIMENTAL } from './actionTypes';

export function showExperimental(state) {
  return {
    type: SHOW_EXPERIMENTAL, state
  };
}

export function showAppError(error) {
  return {
    type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response
  };
}

export default {
  showExperimental,
  showAppError,
};

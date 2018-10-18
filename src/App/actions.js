import {
  SHOW_EXPERIMENTAL,
  TOGGLE_NAVIGATION,
} from './constants';

export function showExperimental(state) {
  return {
    type: SHOW_EXPERIMENTAL, state,
  };
}

export function toggleNavigation() {
  return {
    type: TOGGLE_NAVIGATION,
  };
}

export function showAppError(error) {
  return {
    type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response,
  };
}

export default {
  showExperimental,
  toggleNavigation,
  showAppError,
};

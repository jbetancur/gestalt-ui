import { SHOW_EXPERIMENTAL } from './actionTypes';

export function showExperimental(state) {
  return {
    type: SHOW_EXPERIMENTAL, state
  };
}

export default {
  showExperimental,
};

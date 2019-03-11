import {
  SELECT_RUNTIME,
} from './actionTypes';

export function setRunTime(runtime = {}) {
  return { type: SELECT_RUNTIME, runtime };
}

export default {
  setRunTime,
};

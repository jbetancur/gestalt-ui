import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
} from './actionTypes';

export function addNotification(message) {
  return { type: ADD_NOTIFICATION, message };
}

export function removeNotification(message) {
  return { type: REMOVE_NOTIFICATION, message };
}

export default {
  addNotification,
  removeNotification,
};

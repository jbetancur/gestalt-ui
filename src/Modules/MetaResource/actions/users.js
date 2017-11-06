import * as types from '../actionTypes';

/**
 * unloadUsers
 */
export function unloadUsers() {
  return { type: types.UNLOAD_USERS };
}

/**
 * unloadUser
 */
export function unloadUser() {
  return { type: types.UNLOAD_USER };
}

/**
 * fetchUsers
 * @param {string} fqon
 */
export function fetchUsers(fqon) {
  return { type: types.FETCH_USERS_REQUEST, fqon };
}

/**
 * fetchUser
 * @param {string} fqon
 * @param {string} userId
 */
export function fetchUser(fqon, userId) {
  return { type: types.FETCH_USER_REQUEST, fqon, userId };
}

/**
 * createUser
 * @param {string} fqon
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function createUser(fqon, payload, onSuccess) {
  return { type: types.CREATE_USER_REQUEST, fqon, payload, onSuccess };
}

/**
 * updateUser
 * @param {string} fqon
 * @param {string} userId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateUser(fqon, userId, payload, onSuccess) {
  return { type: types.UPDATE_USER_REQUEST, fqon, userId, payload, onSuccess };
}

/**
 * deleteUser
 * @param {string} fqon
 * @param {string} userId
 * @callback {*} onSuccess
 */
export function deleteUser(fqon, userId, onSuccess) {
  return { type: types.DELETE_USER_REQUEST, fqon, userId, onSuccess };
}

/**
 * deleteUsers
 * @param {Array} userIds
 * @param {string} fqon
 * @callback {*} onSuccess
 */
export function deleteUsers(userIds, fqon, onSuccess) {
  return { type: types.DELETE_USERS_REQUEST, userIds, fqon, onSuccess };
}

export default {
  unloadUsers,
  unloadUser,
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
  deleteUsers,
};

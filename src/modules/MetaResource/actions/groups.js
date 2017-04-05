import * as types from '../actionTypes';

/**
 * unloadGroups
 */
export function unloadGroups() {
  return { type: types.UNLOAD_GROUPS };
}

/**
 * fetchGroups
 * @param {string} fqon
 */
export function fetchGroups(fqon) {
  return { type: types.FETCH_GROUPS_REQUEST, fqon };
}

/**
 * fetchGroup
 * @param {string} fqon
 * @param {string} groupId
 */
export function fetchGroup(fqon, groupId) {
  return { type: types.FETCH_GROUP_REQUEST, fqon, groupId };
}

/**
 * createGroup
 * @param {string} fqon
 * @param {Object} payload
 * @callback {*} onSuccess
 */
export function createGroup(fqon, payload, onSuccess) {
  return { type: types.CREATE_GROUP_REQUEST, fqon, payload, onSuccess };
}

/**
 * updateGroup
 * @param {string} fqon
 * @param {string} groupId
 * @param {Array} payload
 * @callback {*} onSuccess
 */
export function updateGroup(fqon, groupId, payload, onSuccess) {
  return { type: types.UPDATE_GROUP_REQUEST, fqon, groupId, payload, onSuccess };
}

/**
 * deleteGroup
 * @param {string} fqon
 * @param {string} groupId
 * @callback {*} onSuccess
 */
export function deleteGroup(fqon, groupId, onSuccess) {
  return { type: types.DELETE_GROUP_REQUEST, fqon, groupId, onSuccess };
}

/**
 * deleteGroups
 * @param {Array} groupIds
 * @param {string} fqon
 * @callback {*} onSuccess
 */
export function deleteGroups(groupIds, fqon, onSuccess) {
  return { type: types.DELETE_GROUPS_REQUEST, groupIds, fqon, onSuccess };
}

/**
 * addGroupMember
 * @param {string} fqon
 * @param {string} groupId
 * @param {string} userId
 * @callback {*} onSuccess
 */
export function addGroupMember(fqon, groupId, userId, onSuccess) {
  return { type: types.ADD_GROUP_MEMBER_REQUEST, fqon, groupId, userId, onSuccess };
}

/**
 * removeGroupMember
 * @param {string} fqon
 * @param {string} groupId
 * @param {string} userId
 * @callback {*} onSuccess
 */
export function removeGroupMember(fqon, groupId, userId, onSuccess) {
  return { type: types.REMOVE_GROUP_MEMBER_REQUEST, fqon, groupId, userId, onSuccess };
}

export default {
  unloadGroups,
  fetchGroups,
  fetchGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  deleteGroups,
  addGroupMember,
  removeGroupMember,
};

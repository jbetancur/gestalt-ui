import * as types from '../actionTypes';
import * as actions from './groups';

describe('Group Actions', () => {
  it('should request UNLOAD_GROUPS', () => {
    const expectedAction = {
      type: types.UNLOAD_GROUPS,
    };

    expect(actions.unloadGroups()).toEqual(expectedAction);
  });

  it('should request UNLOAD_GROUP', () => {
    const expectedAction = {
      type: types.UNLOAD_GROUP,
    };

    expect(actions.unloadGroup()).toEqual(expectedAction);
  });

  it('should request FETCH_GROUPS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_GROUPS_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchGroups('iamfqon', '1')).toEqual(expectedAction);
  });

  it('should request FETCH_GROUP_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_GROUP_REQUEST,
      fqon: 'iamfqon',
      groupId: '1',
    };

    expect(actions.fetchGroup('iamfqon', '1')).toEqual(expectedAction);
  });

  it('should handle CREATE_GROUP_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_GROUP_REQUEST,
      fqon: 'iamfqon',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createGroup('iamfqon', { name: 'test' })).toEqual(expectedAction);
  });

  it('should handle UPDATE_GROUP_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_GROUP_REQUEST,
      fqon: 'iamfqon',
      groupId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateGroup('iamfqon', '1', [])).toEqual(expectedAction);
  });

  it('should handle DELETE_GROUP_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_GROUP_REQUEST,
      fqon: 'iamfqon',
      groupId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteGroup('iamfqon', '1')).toEqual(expectedAction);
  });

  it('should handle DELETE_GROUPS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_GROUPS_REQUEST,
      groupIds: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deleteGroups([], 'iamfqon')).toEqual(expectedAction);
  });

  it('should request ADD_GROUP_MEMBER_REQUEST', () => {
    const expectedAction = {
      type: types.ADD_GROUP_MEMBER_REQUEST,
      fqon: 'iamfqon',
      groupId: '1',
      userId: '2',
      onSuccess: undefined,
    };

    expect(actions.addGroupMember('iamfqon', '1', '2')).toEqual(expectedAction);
  });

  it('should request REMOVE_GROUP_MEMBER_REQUEST', () => {
    const expectedAction = {
      type: types.REMOVE_GROUP_MEMBER_REQUEST,
      fqon: 'iamfqon',
      groupId: '1',
      userId: '2',
      onSuccess: undefined,
    };

    expect(actions.removeGroupMember('iamfqon', '1', '2')).toEqual(expectedAction);
  });
});

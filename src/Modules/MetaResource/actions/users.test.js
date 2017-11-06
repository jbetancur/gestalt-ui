import * as types from '../actionTypes';
import * as actions from './users';

describe('User Actions', () => {
  it('should request UNLOAD_USERS', () => {
    const expectedAction = {
      type: types.UNLOAD_USERS,
    };

    expect(actions.unloadUsers()).to.deep.equal(expectedAction);
  });

  it('should request UNLOAD_USER', () => {
    const expectedAction = {
      type: types.UNLOAD_USER,
    };

    expect(actions.unloadUser()).to.deep.equal(expectedAction);
  });

  it('should request FETCH_USERS_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_USERS_REQUEST,
      fqon: 'iamfqon',
    };

    expect(actions.fetchUsers('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should request FETCH_USER_REQUEST', () => {
    const expectedAction = {
      type: types.FETCH_USER_REQUEST,
      fqon: 'iamfqon',
      userId: '1',
    };

    expect(actions.fetchUser('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle CREATE_USER_REQUEST', () => {
    const expectedAction = {
      type: types.CREATE_USER_REQUEST,
      fqon: 'iamfqon',
      payload: { name: 'test' },
      onSuccess: undefined,
    };

    expect(actions.createUser('iamfqon', { name: 'test' })).to.deep.equal(expectedAction);
  });

  it('should handle UPDATE_USER_REQUEST', () => {
    const expectedAction = {
      type: types.UPDATE_USER_REQUEST,
      fqon: 'iamfqon',
      userId: '1',
      payload: [],
      onSuccess: undefined,
    };

    expect(actions.updateUser('iamfqon', '1', [])).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_USER_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_USER_REQUEST,
      fqon: 'iamfqon',
      userId: '1',
      onSuccess: undefined,
    };

    expect(actions.deleteUser('iamfqon', '1')).to.deep.equal(expectedAction);
  });

  it('should handle DELETE_USERS_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_USERS_REQUEST,
      userIds: [],
      fqon: 'iamfqon',
      onSuccess: undefined,
    };

    expect(actions.deleteUsers([], 'iamfqon')).to.deep.equal(expectedAction);
  });
});

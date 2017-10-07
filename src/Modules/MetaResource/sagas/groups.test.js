import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import groupSagas, {
  fetchGroups,
  fetchGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  deleteGroups,
  addGroupMember,
  removeGroupMember,
} from './groups';
import * as types from '../actionTypes';

describe('Group Sagas', () => {
  const error = 'an error has occured';

  describe('fetchGroups Sequence', () => {
    const saga = fetchGroups({ fqon: 'iamfqon' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/groups?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: 1 }] });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_GROUPS_FULFILLED, payload: [{ id: 1 }] })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchGroups({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_GROUPS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchGroup Sequence', () => {
    const saga = fetchGroup({ fqon: 'iamfqon', groupId: '1' });
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/groups/1')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });

      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_GROUP_FULFILLED, payload: { id: 1 } })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchGroup({ fqon: 'iamfqon', groupId: 1 });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_GROUP_REJECTED, payload: error })
      );
    });
  });

  describe('createGroup Sequence', () => {
    const action = { fqon: 'iamfqon', payload: { name: 'iamnewGroup' } };
    const saga = createGroup(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/groups', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.CREATE_GROUP_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = createGroup(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createGroup(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.CREATE_GROUP_REJECTED, payload: error })
      );
    });
  });

  describe('updateGroup Sequence', () => {
    const action = { fqon: 'iamfqon', groupId: '1', payload: [] };
    const saga = updateGroup(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.patch, 'iamfqon/groups/1', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_GROUP_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = updateGroup(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateGroup(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.UPDATE_GROUP_REJECTED, payload: error })
      );
    });
  });

  describe('deleteGroup Sequence', () => {
    const action = { fqon: 'iamfqon', groupId: '1' };
    const saga = deleteGroup(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.delete, 'iamfqon/groups/1?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_GROUP_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteGroup(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteGroup(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_GROUP_REJECTED, payload: error })
      );
    });
  });

  describe('deleteGroups Sequence', () => {
    const action = { groupIds: ['1'], fqon: 'iamfqon' };
    const saga = deleteGroups(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.all, [axios.delete('iamfqon/groups/1?force=true')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_GROUP_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteGroups(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteGroups(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_GROUP_REJECTED, payload: error })
      );
    });
  });

  describe('addGroupMember Sequence', () => {
    const action = { fqon: 'iamfqon', groupId: '1', userId: '2' };
    const saga = addGroupMember(action);
    let result;

    it('should make an api call to patch', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.patch, 'iamfqon/groups/1/users?id=2', [])
      );
    });

    it('should make an api call to get the updated group', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/groups/1?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.ADD_GROUP_MEMBER_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = addGroupMember(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = addGroupMember(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.ADD_GROUP_MEMBER_REJECTED, payload: error })
      );
    });
  });

  describe('removeGroupMember Sequence', () => {
    const action = { fqon: 'iamfqon', groupId: '1', userId: '2' };
    const saga = removeGroupMember(action);
    let result;

    it('should make an api call to delete', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.delete, 'iamfqon/groups/1/users?id=2', [])
      );
    });

    it('should make an api call to get the updated group', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/groups/1?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.REMOVE_GROUP_MEMBER_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = removeGroupMember(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = removeGroupMember(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.REMOVE_GROUP_MEMBER_REJECTED, payload: error })
      );
    });
  });

  describe('groupSagas', () => {
    let result;
    const rootSaga = groupSagas();

    it('should fork a watcher for fetchGroups', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_GROUPS_REQUEST, fetchGroups)
      );
    });

    it('should fork a watcher for fetchGroup', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_GROUP_REQUEST, fetchGroup)
      );
    });

    it('should fork a watcher for createGroup', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.CREATE_GROUP_REQUEST, createGroup)
      );
    });

    it('should fork a watcher for updateGroup', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.UPDATE_GROUP_REQUEST, updateGroup)
      );
    });

    it('should fork a watcher for deleteGroup', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_GROUP_REQUEST, deleteGroup)
      );
    });

    it('should fork a watcher for deleteGroups', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_GROUPS_REQUEST, deleteGroups)
      );
    });

    it('should fork a watcher for addGroupMember', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.ADD_GROUP_MEMBER_REQUEST, addGroupMember)
      );
    });

    it('should fork a watcher for removeGroupMember', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.REMOVE_GROUP_MEMBER_REQUEST, removeGroupMember)
      );
    });
  });
});

import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import groupSagas, {
  addGroupMember,
  removeGroupMember,
} from './members';
import {
  ADD_GROUPMEMBER_REQUEST,
  ADD_GROUPMEMBER_FULFILLED,
  ADD_GROUPMEMBER_REJECTED,
  REMOVE_GROUPMEMBER_REQUEST,
  REMOVE_GROUPMEMBER_FULFILLED,
  REMOVE_GROUPMEMBER_REJECTED,
} from '../constants';

describe('Group Sagas', () => {
  describe('addGroupMember Sequence', () => {
    const error = 'an error has occured';
    const action = { fqon: 'iamfqon', groupId: '1', userId: '2' };
    const saga = addGroupMember(action);
    let result;

    it('should make an api call to patch', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.patch, 'iamfqon/groups/1/users?id=2', [])
      );
    });

    it('should make an api call to get the updated group', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/groups/1?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: ADD_GROUPMEMBER_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = addGroupMember(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).toBeCalledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = addGroupMember(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: ADD_GROUPMEMBER_REJECTED, payload: error })
      );
    });
  });

  describe('removeGroupMember Sequence', () => {
    const error = 'an error has occured';
    const action = { fqon: 'iamfqon', groupId: '1', userId: '2' };
    const saga = removeGroupMember(action);
    let result;

    it('should make an api call to delete', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(axios.delete, 'iamfqon/groups/1/users?id=2', [])
      );
    });

    it('should make an api call to get the updated group', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        call(axios.get, 'iamfqon/groups/1?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).toEqual(
        put({ type: REMOVE_GROUPMEMBER_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: jest.fn() };
      const sagaSuccess = removeGroupMember(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).toBeCalledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = removeGroupMember(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).toEqual(
        put({ type: REMOVE_GROUPMEMBER_REJECTED, payload: error })
      );
    });
  });

  describe('groupSagas', () => {
    let result;
    const rootSaga = groupSagas();

    it('should fork a watcher for addGroupMember', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, ADD_GROUPMEMBER_REQUEST, addGroupMember)
      );
    });

    it('should fork a watcher for removeGroupMember', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, REMOVE_GROUPMEMBER_REQUEST, removeGroupMember)
      );
    });
  });
});

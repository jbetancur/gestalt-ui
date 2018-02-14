import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import resourceTypeSagas, {
  fetchResourceType,
  fetchResourceTypes,
  fetchResourceTypesDropDown,
  createResourceType,
  updateResourceType,
  deleteResourceType,
  deleteResourceTypes,
} from './resourceTypes';
import * as types from '../actionTypes';

describe('Resource Type Sagas', () => {
  const error = 'an error has occured';

  describe('fetchResourceType Sequence', () => {
    let result;
    const saga = fetchResourceType({ fqon: 'iamfqon', resourceTypeId: '1' });
    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/resourcetypes/1?withprops=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: '1' } });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_RESOURCETYPE_FULFILLED, payload: { id: '1' } })
      );
    });
  });

  describe('fetchResourceType Sequence Errors', () => {
    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchResourceType({ fqon: 'poopy' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_RESOURCETYPE_REJECTED, payload: error })
      );
    });
  });

  describe('fetchResourceTypes Sequence', () => {
    let result;
    const saga = fetchResourceTypes({ fqon: 'iamfqon' });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/resourcetypes?expand=true')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: '1' }] });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_RESOURCETYPES_FULFILLED, payload: [{ id: '1' }] })
      );
    });

    describe('fetchResourceTypes Sequence Errors', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = fetchResourceTypes({ fqon: 'poopy' });
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).to.deep.equal(
          put({ type: types.FETCH_RESOURCETYPES_REJECTED, payload: error })
        );
      });
    });
  });

  describe('fetchResourceTypes Sequence with a filter', () => {
    let result;
    const saga = fetchResourceTypes({ fqon: 'iamfqon', filter: 'morty' });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/resourcetypes?expand=true&type=morty')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ id: '1' }] });
      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_RESOURCETYPES_FULFILLED, payload: [{ id: '1' }] })
      );
    });
  });

  describe('fetchResourceTypesDropDown Sequence', () => {
    describe('fetchResourceTypesDropDown when there are resourcetypes', () => {
      const saga = fetchResourceTypesDropDown({ fqon: 'iamfqon', environmentId: '1' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/resourcetypes?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [{ id: '1', name: 'morty' }] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_RESOURCETYPES_DROPDOWN_FULFILLED, payload: [{ id: '1', name: 'morty' }] })
        );
      });

      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = fetchResourceTypesDropDown({ fqon: 'iamfqon' });
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).to.deep.equal(
          put({ type: types.FETCH_RESOURCETYPES_DROPDOWN_REJECTED, payload: error })
        );
      });
    });

    describe('fetchResourceTypesDropDown when there are NO providers', () => {
      const saga = fetchResourceTypesDropDown({ fqon: 'iamfqon', environmentId: 1 });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/resourcetypes?expand=true')
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next({ data: [] });
        expect(result.value).to.deep.equal(
          put({ type: types.FETCH_RESOURCETYPES_DROPDOWN_FULFILLED, payload: [{ id: '', name: 'No Available Resource Types' }] })
        );
      });
    });
  });

  describe('createResourceType Sequence', () => {
    const action = { fqon: 'iamfqon', payload: { name: 'iamnewresource' } };
    const saga = createResourceType(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/resourcetypes', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.CREATE_RESOURCETYPE_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', payload: { name: 'iamnewresource' }, onSuccess: sinon.stub() };
      const sagaSuccess = createResourceType(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createResourceType(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.CREATE_RESOURCETYPE_REJECTED, payload: error })
      );
    });
  });

  describe('updateResourceType Sequence', () => {
    const action = { fqon: 'iamfqon', resourceTypeId: '1', payload: [] };
    const saga = updateResourceType(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.patch, 'iamfqon/resourcetypes/1?withprops=true', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_RESOURCETYPE_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', resourceTypeId: '1', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updateResourceType(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateResourceType(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.UPDATE_RESOURCETYPE_REJECTED, payload: error })
      );
    });
  });

  describe('deleteResourceType Sequence', () => {
    const action = { fqon: 'iamfqon', resourceTypeId: '1' };
    const saga = deleteResourceType(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.delete, 'iamfqon/resourcetypes/1?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_RESOURCETYPE_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteResourceType(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteResourceType(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_RESOURCETYPE_REJECTED, payload: error })
      );
    });
  });

  describe('deleteResourceTypes Sequence', () => {
    const action = { resourceTypeIds: ['1'], fqon: 'iamfqon' };
    const saga = deleteResourceTypes(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.all, [axios.delete('iamfqon/resourcetypes/1?force=true')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_RESOURCETYPE_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteResourceTypes(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteResourceTypes(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_RESOURCETYPE_REJECTED, payload: error })
      );
    });
  });

  describe('resourceTypeSagas', () => {
    let result;
    const rootSaga = resourceTypeSagas();

    it('should fork a watcher for fetchResourceType', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_RESOURCETYPE_REQUEST, fetchResourceType)
      );
    });

    it('should fork a watcher for fetchResourceTypes', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_RESOURCETYPES_REQUEST, fetchResourceTypes)
      );
    });

    it('should fork a watcher for fetchResourceTypesDropDown', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_RESOURCETYPES_DROPDOWN_REQUEST, fetchResourceTypesDropDown)
      );
    });

    it('should fork a watcher for createResourceType', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.CREATE_RESOURCETYPE_REQUEST, createResourceType)
      );
    });

    it('should fork a watcher for updateResourceType', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.UPDATE_RESOURCETYPE_REQUEST, updateResourceType)
      );
    });

    it('should fork a watcher for deleteResourceType', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_RESOURCETYPE_REQUEST, deleteResourceType)
      );
    });

    it('should fork a watcher for deleteResourceTypes', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_RESOURCETYPES_REQUEST, deleteResourceTypes)
      );
    });
  });
});

import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import apiSagas, {
  fetchAPIEndpoints,
  fetchAPIEndpoint,
  createAPIEndpoint,
  updateAPIEndpoint,
  deleteAPIEndpoint,
  deleteAPIEndpoints,
} from './apiEndpoints';
import * as types from '../actionTypes';

const scaffoldEndpointTest = (saga) => {
  let result;

  it('should make an api call for the provider', () => {
    // eslint-disable-next-line no-param-reassign
    result = saga.next({ data: [{ id: 1, properties: { parent: { name: 'testapi' }, resource: '/testpath', location_id: 42 } }] });
    expect(result.value).to.deep.equal(
      call(axios.get, 'iamfqon/providers/42')
    );
  });

  it('should return a payload and dispatch a success status', () => {
    // eslint-disable-next-line no-param-reassign
    result = saga.next({ data: { id: 1, properties: { config: { env: { public: { PUBLIC_URL_VHOST_0: 'vhostness' } }, external_protocol: 'https' } } } });
    expect(result.value).to.deep.equal(
      put({
        type: types.FETCH_APIENDPOINTS_FULFILLED,
        payload: [
          { id: 1, properties: { public_url: 'https://vhostness/testapi/testpath', parent: { name: 'testapi' }, resource: '/testpath', location_id: 42 } }]
      })
    );
  });

  return result;
};

describe('API Endpoint Sagas', () => {
  const error = 'an error has occured';

  describe('fetchAPIEndpoints Sequence', () => {
    describe('when entityId is present and entityKey is "apis"', () => {
      const saga = fetchAPIEndpoints({ fqon: 'iamfqon', entityId: '1', entityKey: 'apis' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/apis/1/apiendpoints?expand=true')
        );
      });

      scaffoldEndpointTest(saga);
    });

    describe('when no entites are passed"', () => {
      const saga = fetchAPIEndpoints({ fqon: 'iamfqon' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/apiendpoints?expand=true')
        );
      });

      scaffoldEndpointTest(saga);
    });

    describe('when a singular entityKey/Id is passed (container, lamnda...)', () => {
      const saga = fetchAPIEndpoints({ fqon: 'iamfqon', entityId: '1', entityKey: 'lambda' });
      let result;

      it('should make an api call', () => {
        result = saga.next();
        expect(result.value).to.deep.equal(
          call(axios.get, 'iamfqon/apiendpoints?expand=true&implementation_type=lambda&implementation_id=1')
        );
      });

      scaffoldEndpointTest(saga);
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchAPIEndpoints({ fqon: 'iamfqon' });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_APIENDPOINTS_REJECTED, payload: error })
      );
    });
  });

  describe('fetchAPIEndpoint Sequence', () => {
    const action = { fqon: 'iamfqon', apiendpointId: '1' };
    const saga = fetchAPIEndpoint(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.get, 'iamfqon/apiendpoints/1')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });

      expect(result.value).to.deep.equal(
        put({ type: types.FETCH_APIENDPOINT_FULFILLED, payload: { id: 1 } })
      );
    });


    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = fetchAPIEndpoint(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();

      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = fetchAPIEndpoint(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.FETCH_APIENDPOINT_REJECTED, payload: error })
      );
    });
  });

  describe('createAPIEndpoint Sequence', () => {
    const action = { fqon: 'iamfqon', apiId: '1', payload: { name: 'iamnewapiendpoint' } };
    const saga = createAPIEndpoint(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.post, 'iamfqon/apis/1/apiendpoints', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.CREATE_APIENDPOINT_FULFILLED, payload: { id: 1 } })
      );
      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = createAPIEndpoint(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = createAPIEndpoint(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.CREATE_APIENDPOINT_REJECTED, payload: error })
      );
    });
  });

  describe('updateAPIEndpoint Sequence', () => {
    const action = { fqon: 'iamfqon', apiendpointId: '1', payload: [] };
    const saga = updateAPIEndpoint(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.patch, 'iamfqon/apiendpoints/1', action.payload)
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: { id: 1 } });
      expect(result.value).to.deep.equal(
        put({ type: types.UPDATE_APIENDPOINT_FULFILLED, payload: { id: 1 } })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { fqon: 'iamfqon', apiendpointId: '1', payload: [], onSuccess: sinon.stub() };
      const sagaSuccess = updateAPIEndpoint(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next({ data: { id: 1 } });
      sagaSuccess.next();
      expect(onSuccessAction.onSuccess).to.have.been.calledWith({ id: 1 });
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = updateAPIEndpoint(action);
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });
      expect(resultError.value).to.deep.equal(
        put({ type: types.UPDATE_APIENDPOINT_REJECTED, payload: error })
      );
    });
  });

  describe('deleteAPIEndpoint Sequence', () => {
    const action = { fqon: 'iamfqon', apiendpointId: '1' };
    const saga = deleteAPIEndpoint(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.delete, 'iamfqon/apiendpoints/1?force=true')
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_APIENDPOINTS_FULFILLED, payload: action.apiendpointId })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteAPIEndpoint(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteAPIEndpoint(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_APIENDPOINTS_REJECTED, payload: error })
      );
    });
  });

  describe('deleteAPIEndpoints Sequence', () => {
    const action = { apiendpointIds: ['1'], fqon: 'iamfqon' };
    const saga = deleteAPIEndpoints(action);
    let result;

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        call(axios.all, [axios.delete('iamfqon/apiendpoints/1?force=true')])
      );
    });

    it('should return dispatch a success status', () => {
      result = saga.next();
      expect(result.value).to.deep.equal(
        put({ type: types.DELETE_APIENDPOINT_FULFILLED })
      );

      // Finish the iteration
      result = saga.next();
    });

    it('should return a response when onSuccess callback is passed', () => {
      const onSuccessAction = { ...action, onSuccess: sinon.stub() };
      const sagaSuccess = deleteAPIEndpoints(onSuccessAction);
      sagaSuccess.next();
      sagaSuccess.next();
      sagaSuccess.next();
      // eslint-disable-next-line no-unused-expressions
      expect(onSuccessAction.onSuccess).to.have.been.called;
    });

    it('should dispatch a reject status when there is an error', () => {
      const sagaError = deleteAPIEndpoints(action);
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).to.deep.equal(
        put({ type: types.DELETE_APIENDPOINT_REJECTED, payload: error })
      );
    });
  });

  describe('apiEndpointSagas', () => {
    let result;
    const rootSaga = apiSagas();

    it('should fork a watcher for fetchAPIEndpoints', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_APIENDPOINTS_REQUEST, fetchAPIEndpoints)
      );
    });

    it('should fork a watcher for fetchAPIEndpoint', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.FETCH_APIENDPOINT_REQUEST, fetchAPIEndpoint)
      );
    });

    it('should fork a watcher for createAPIEndpoint', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.CREATE_APIENDPOINT_REQUEST, createAPIEndpoint)
      );
    });

    it('should fork a watcher for updateAPIEndpoint', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.UPDATE_APIENDPOINT_REQUEST, updateAPIEndpoint)
      );
    });

    it('should fork a watcher for deleteAPIEndpoint', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_APIENDPOINT_REQUEST, deleteAPIEndpoint)
      );
    });

    it('should fork a watcher for deleteAPIEndpoints', () => {
      result = rootSaga.next();
      expect(result.value).to.deep.equal(
        fork(takeLatest, types.DELETE_APIENDPOINTS_REQUEST, deleteAPIEndpoints)
      );
    });
  });
});

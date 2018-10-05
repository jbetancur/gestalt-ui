import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import containerSagas, {
  createViewWorkflow,
  editViewWorkflow,
} from './formWorkflows';
import {
  INIT_CONTAINERCREATE_REQUEST,
  INIT_CONTAINERCREATE_FULFILLED,
  INIT_CONTAINERCREATE_REJECTED,
  INIT_CONTAINEREDIT_REQUEST,
  INIT_CONTAINEREDIT_FULFILLED,
  INIT_CONTAINEREDIT_REJECTED,
} from '../constants';
import { setSelectedProvider } from '../actions';

describe('container Form Workflow Sagas', () => {
  const error = 'an error has occured';

  describe('createViewWorkflow Sequence', () => {
    describe('when the workflow is invoked', () => {
      const saga = createViewWorkflow();
      let result;

      it('should make an api call for all view state resources', () => {
        result = saga.next();
        result = saga.next('123'); // this environment id state that should exist
        result = saga.next({ environment: { id: '123', org: { properties: { fqon: 'test' } } } }); // mock state
        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/environments/123/providers?expand=true&type=CaaS'),
            axios.get('test/environments/123/secrets?expand=true'),
            axios.get('test/environments/123/volumes?expand=true'),
          ]),
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: [{ name: 'a provider' }] },
          { data: [{ name: 'a volume' }] },
          { data: [{ name: 'a secret' }] },
        ]);

        const payload = {
          providers: [{ name: 'a provider' }],
          volumes: [{ name: 'a volume' }],
          secrets: [{ name: 'a secret' }],
        };

        expect(result.value).toEqual(
          put({ type: INIT_CONTAINERCREATE_FULFILLED, payload })
        );
      });
    });

    describe('when there is an Error', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = createViewWorkflow();
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).toEqual(
          put({ type: INIT_CONTAINERCREATE_REJECTED, payload: error })
        );
      });
    });
  });

  describe('editViewWorkflow Sequence', () => {
    describe('when the workflow is invoked', () => {
      const saga = editViewWorkflow({ containerId: '890' });
      let result;

      it('should make an api call for all view state resources', () => {
        result = saga.next();
        result = saga.next('123'); // this environment id state that should exist
        result = saga.next({ environment: { id: '123', org: { properties: { fqon: 'test' } } } }); // mock state

        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/containers/890?embed=provider'),
            axios.get('test/environments/123/secrets?expand=true'),
            axios.get('test/environments/123/volumes?expand=true'),
          ]),
        );
      });

      it('should make an api call for the environment envs', () => {
        result = saga.next([
          { data: { id: '890', name: 'a container', properties: { provider: { id: '333' } } } },
          { data: [{ name: 'a secret' }] },
          { data: [{ name: 'a volume' }] },
        ]);

        expect(result.value).toEqual(
          call(axios.get, 'test/environments/123/env')
        );
      });

      it('should set call the action to set the selected provider', () => {
        result = saga.next({ data: { test: 'testvar' } });

        expect(result.value).toEqual(
          put(setSelectedProvider({ id: '333' }))
        );
      });

      it('should return a payload and dispatch a success status and merge any env vars', () => {
        result = saga.next();

        const payload = {
          secrets: [{ name: 'a secret' }],
          volumes: [{ name: 'a volume' }],
          container: { id: '890', name: 'a container', properties: { env: [{ name: 'test', value: 'testvar', inherited: true }], provider: { id: '333' } } },
        };

        // we need action to be passed for the polling function
        const action = { fqon: 'test', containerId: '890', entityKey: 'environments', entityId: '123' };

        expect(result.value).toEqual(
          put({ type: INIT_CONTAINEREDIT_FULFILLED, action, payload })
        );
      });

      describe('when there is an Error', () => {
        it('should return a payload and dispatch a reject status when there is an error', () => {
          const sagaError = editViewWorkflow({ fqon: 'test' });
          let resultError = sagaError.next();

          resultError = sagaError.throw({ message: error });

          expect(resultError.value).toEqual(
            put({ type: INIT_CONTAINEREDIT_REJECTED, payload: error })
          );
        });
      });
    });
  });

  describe('Container workflow sagas', () => {
    let result;
    const rootSaga = containerSagas();

    it('should fork a watcher for createViewWorkflow', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, INIT_CONTAINERCREATE_REQUEST, createViewWorkflow)
      );
    });

    it('should fork a watcher for editViewWorkflow', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(takeLatest, INIT_CONTAINEREDIT_REQUEST, editViewWorkflow)
      );
    });
  });
});

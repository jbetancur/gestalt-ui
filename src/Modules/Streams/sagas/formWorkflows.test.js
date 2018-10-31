import axios from 'axios';
import { call, put, fork } from 'redux-saga/effects';
import streamSpecSagas, {
  createViewWorkflow,
  editViewWorkflow,
  watchCreateViewWorkflow,
  watchEditViewWorkflow,
} from './formWorkflows';
import {
  INIT_STREAMSPECCREATE_FULFILLED,
  INIT_STREAMSPECCREATE_REJECTED,
  INIT_STREAMSPECEDIT_FULFILLED,
  INIT_STREAMSPECEDIT_REJECTED,
} from '../constants';

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
            axios.get('test/environments/123/providers?expand=true&type=StreamProvider'),
            axios.get('test/environments/123/datafeeds?expand=true'),
            axios.get('test/environments/123/lambdas?expand=true'),
          ]),
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: [{ name: 'a provider' }] },
          { data: [{ name: 'a feed' }] },
          { data: [{ name: 'a lambda', properties: { runtime: 'java' } }] },
        ]);

        const payload = {
          providers: [{ name: 'a provider' }],
          datafeeds: [{ name: 'a feed' }],
          lambdas: [{ name: 'a lambda', properties: { runtime: 'java' } }],
        };

        expect(result.value).toEqual(
          put({ type: INIT_STREAMSPECCREATE_FULFILLED, payload })
        );
      });
    });

    describe('when there is an Error', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = createViewWorkflow();
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).toEqual(
          put({ type: INIT_STREAMSPECCREATE_REJECTED, payload: error })
        );
      });
    });
  });

  describe('editViewWorkflow Sequence', () => {
    describe('when the workflow is invoked', () => {
      const saga = editViewWorkflow({ streamSpecId: '890' });
      let result;

      it('should make an api call for all view state resources', () => {
        result = saga.next();
        result = saga.next('123'); // this environment id state that should exist
        result = saga.next({ environment: { id: '123', org: { properties: { fqon: 'test' } } } }); // mock state

        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/streamspecs/890'),
            axios.get('test/environments/123/providers?expand=true&type=StreamProvider'),
            axios.get('test/environments/123/datafeeds?expand=true'),
            axios.get('test/environments/123/lambdas?expand=true'),
            axios.get('test/environments/123/actions?expand=true&filter=streamspec.edit&filter=streamspec.instances'),
          ]),
        );
      });

      it('should return a payload and dispatch a success status and merge any env vars', () => {
        result = saga.next([
          { data: { id: '890', name: 'a stream' } },
          { data: [{ name: 'a provider' }] },
          { data: [{ name: 'a feed' }] },
          { data: [{ name: 'a lambda', properties: { runtime: 'java' } }] },
          {
            data: [
              { name: 'action A', locations: ['streamspec.edit'] },
              { name: 'action B', locations: ['streamspec.instances'] },
            ]
          },
        ]);

        const payload = {
          streamSpec: { id: '890', name: 'a stream' },
          providers: [{ name: 'a provider' }],
          datafeeds: [{ name: 'a feed' }],
          lambdas: [{ name: 'a lambda', properties: { runtime: 'java' } }],
          actions: [{ name: 'action A', locations: ['streamspec.edit'] }],
          instanceActions: [{ name: 'action B', locations: ['streamspec.instances'] }],
        };

        expect(result.value).toEqual(
          put({ type: INIT_STREAMSPECEDIT_FULFILLED, payload })
        );
      });

      describe('when there is an Error', () => {
        it('should return a payload and dispatch a reject status when there is an error', () => {
          const sagaError = editViewWorkflow({ fqon: 'test' });
          let resultError = sagaError.next();

          resultError = sagaError.throw({ message: error });

          expect(resultError.value).toEqual(
            put({ type: INIT_STREAMSPECEDIT_REJECTED, payload: error })
          );
        });
      });
    });
  });

  describe('Stream Spec workflow sagas', () => {
    let result;
    const rootSaga = streamSpecSagas();

    it('should fork a watcher for createViewWorkflow', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(watchCreateViewWorkflow)
      );
    });

    it('should fork a watcher for editViewWorkflow', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(watchEditViewWorkflow)
      );
    });
  });
});

import axios from 'axios';
import { call, put, fork, takeLatest } from 'redux-saga/effects';
import { fetchAPI } from 'config/lib/utility';
import providerSagas, {
  createViewWorkflow,
  editViewWorkflow,
  fetchContainer,
  handleSelectedProviderType,
  watchCreateViewWorkflow,
  watchEditViewWorkflow,
  watchContainerWorkflow
} from './formWorkflows';
import {
  INIT_PROVIDERCREATE_FULFILLED,
  INIT_PROVIDERCREATE_REJECTED,
  INIT_PROVIDEREDIT_FULFILLED,
  INIT_PROVIDEREDIT_REJECTED,
  FETCH_PROVIDERCONTAINER_FULFILLED,
  FETCH_PROVIDERCONTAINER_REJECTED,
  SELECTED_PROVIDERTYPE_REQUEST,
  SELECTED_PROVIDERTYPE_FULFILLED,
  SELECTED_PROVIDERTYPE_REJECTED,
} from '../actionTypes';
import { setSelectedProvider } from '../../Containers/actions';
import containerModel from '../../Containers/models/container';

jest.mock('../../Containers/actions', () => ({
  setSelectedProvider: () => ([{
    type: 'containers/SELECTED_PROVIDER',
    supportsSecrets: false,
    supportsEvents: false,
    supportsHealth: false,
    supportsOther: false,
    networks: [Array],
    providerType: undefined,
    provider: { id: '212', name: 'some provider...', properties: {} },
  }]),
}));

jest.mock('../lists/providerTypes', () => ({
  generateResourceTypeSchema: () => ([{
    id: '777',
    name: 'Gestalt::Configuration::Provider::VOLTRON',
    type: 'Gestalt::Configuration::Provider::VOLTRON',
    allowEnvVariables: true,
    allowLinkedProviders: false,
    displayName: 'VOLTRON',
  }]),
}));

describe('provider Form Workflow Sagas', () => {
  const error = 'an error has occured';

  describe('createViewWorkflow Sequence', () => {
    describe('when the workflow is invoked', () => {
      const saga = createViewWorkflow();
      let result;

      it('should make an api call for all view state resources', () => {
        result = saga.next();
        result = saga.next(true); // the completed context state (if context is done being retrieved)
        result = saga.next({
          contextMeta: { context: 'environment' },
          completed: true,
          organization: { id: '234', properties: { fqon: 'test' } },
          environment: { id: '123', org: { properties: { fqon: 'test' } } }
        }); // mock state

        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/resourcetypes?expand=true&type=Gestalt::Configuration::Provider'),
            axios.get('test/environments/123/providers?expand=true'),
          ]),
        );
      });

      it('should return a payload and dispatch a success status', () => {
        result = saga.next([
          { data: [{ id: '777', name: 'Gestalt::Configuration::Provider::VOLTRON' }] },
          { data: [{ id: '888', name: 'a provider' }] },
        ]);

        const payload = {
          resourceTypes: [{
            id: '777',
            name: 'Gestalt::Configuration::Provider::VOLTRON',
            type: 'Gestalt::Configuration::Provider::VOLTRON',
            allowEnvVariables: true,
            allowLinkedProviders: false,
            displayName: 'VOLTRON',
          }],
          providers: [{ id: '888', name: 'a provider' }],
        };

        expect(result.value).toEqual(
          put({ type: INIT_PROVIDERCREATE_FULFILLED, payload })
        );
      });
    });

    describe('when there is an Error', () => {
      it('should return a payload and dispatch a reject status when there is an error', () => {
        const sagaError = createViewWorkflow();
        let resultError = sagaError.next();

        resultError = sagaError.throw({ message: error });

        expect(resultError.value).toEqual(
          put({ type: INIT_PROVIDERCREATE_REJECTED, payload: error })
        );
      });
    });
  });

  describe('editViewWorkflow Sequence', () => {
    describe('when the workflow is invoked', () => {
      const saga = editViewWorkflow({ providerId: '890' });
      let result;

      it('should make an api call for all view state resources', () => {
        result = saga.next();
        result = saga.next(true); // this environment id state that should exist
        result = saga.next({
          contextMeta: { context: 'environment' },
          completed: true,
          organization: { id: '234', properties: { fqon: 'test' } },
          environment: { id: '123', org: { properties: { fqon: 'test' } } }
        }); // mock state

        expect(result.value).toEqual(
          call(axios.all, [
            axios.get('test/providers/890'),
            axios.get('test/environments/123/providers?expand=true'),
          ]),
        );
      });

      it('should make an api call to get the full representation of the resourceType', () => {
        // the resulting provider response
        result = saga.next([
          { data: { id: '890', name: 'a voltron provider', resource_type: 'Gestalt::Configuration::Provider::VOLTRON' } },
          { data: [{ id: '888', name: 'another provider' }] },
        ]);

        expect(result.value).toEqual(
          call(fetchAPI, 'test/resourcetypes?expand=true&type=Gestalt::Configuration::Provider::VOLTRON')
        );
      });

      it('should return a payload and dispatch a success status when', () => {
        // the resuting resource Type response
        result = saga.next({
          data: [{ id: '777', name: 'Gestalt::Configuration::Provider::VOLTRON' }],
        });

        const payload = {
          selectedProviderType: {
            id: '777',
            name: 'Gestalt::Configuration::Provider::VOLTRON',
            type: 'Gestalt::Configuration::Provider::VOLTRON',
            allowEnvVariables: true,
            allowLinkedProviders: false,
            displayName: 'VOLTRON',
          },
          provider: { id: '890', name: 'a voltron provider', resource_type: 'Gestalt::Configuration::Provider::VOLTRON' },
          providers: [{ id: '888', name: 'another provider' }],
          hasContainer: false,
        };

        const action = {
          providerId: '890',
          enablePolling: undefined,
          provider: { id: '890', name: 'a voltron provider', resource_type: 'Gestalt::Configuration::Provider::VOLTRON' },
          providers: [{ id: '888', name: 'another provider' }],
        };

        expect(result.value).toEqual(
          put({ type: INIT_PROVIDEREDIT_FULFILLED, action, payload })
        );
      });

      // describe('when the resouceType hasContainer: true', () => {
      // this is hard to test correctly as this is currently designed in meta
      // omit this test until we refactor provider containers
      // });

      describe('when there is an Error', () => {
        it('should return a payload and dispatch a reject status when there is an error', () => {
          const sagaError = editViewWorkflow({ fqon: 'test' });
          let resultError = sagaError.next();

          resultError = sagaError.throw({ message: error });

          expect(resultError.value).toEqual(
            put({ type: INIT_PROVIDEREDIT_REJECTED, payload: error })
          );
        });
      });
    });
  });


  describe('fetchContainer Workflow', () => {
    const providers = [{ id: '212', name: 'some provider...', properties: {} }];

    describe('when the provider supports a container spec', () => {
      let result;
      const provider = { id: '917', org: { properties: { fqon: 'test' } }, properties: {} };
      const saga = fetchContainer({ provider, providers });

      it('should make an api call to get containers', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(fetchAPI, 'test/providers/917/containers')
        );
      });

      it('should make an api call to get container if there are containers', () => {
        result = saga.next({ data: [{ id: '191' }] });
        expect(result.value).toEqual(
          call(fetchAPI, 'test/containers/191?embed=provider&embed=volumes')
        );
      });

      it('should set call the action to set the selected provider on the container', () => {
        result = saga.next({ data: containerModel.get({ id: '191', properties: { provider: { id: '333' } } }) });

        expect(result.value).toEqual(
          put(setSelectedProvider({ id: '333' }))
        );
      });

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).toEqual(
          put({
            type: FETCH_PROVIDERCONTAINER_FULFILLED,
            payload: containerModel.get({ id: '191', properties: { provider: { id: '333' } } }),
            action: { provider, providers },
          })
        );
      });
    });

    describe('when there are no containers it should fallback', () => {
      let result;
      const provider = {
        id: '917',
        org: { properties: { fqon: 'test' } },
        properties: {
          services: [
            {
              // note name and provider.id must be set so providerModel.get can branch to a provider container
              container_spec: containerModel.get({ name: 'name', properties: { provider: { id: '212', name: 'some provider...', properties: { } } } })
            },
          ],
        },
      };
      const saga = fetchContainer({ provider, providers });

      it('should make an api call to get containers', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(fetchAPI, 'test/providers/917/containers')
        );
      });

      it('should call the action to set the a default provider on the container', () => {
        // no containers were returned
        result = saga.next({ data: [] });

        expect(result.value).toEqual(
          put(setSelectedProvider(provider.properties.services[0].container_spec.properties.provider))
        );
      });

      it('should return dispatch a success status', () => {
        result = saga.next();
        expect(result.value).toEqual(
          put({
            type: FETCH_PROVIDERCONTAINER_FULFILLED,
            payload: containerModel.get(),
            action: { provider, providers },
          })
        );
      });
    });

    describe('when there are no containers the container provider parent is not found it should not be successful', () => {
      let result;
      const provider = {
        id: '917',
        org: { properties: { fqon: 'test' } },
        properties: {
          services: [
            {
              // note name and provider.id must be set so providerModel.get can branch to a provider container
              container_spec: containerModel.get({ name: 'name', properties: { provider: { id: 'never-gonna-match-you-up', name: 'some provider...' } } })
            },
          ],
        },
      };
      const saga = fetchContainer({ provider, providers });

      it('should make an api call to get containers', () => {
        result = saga.next();
        expect(result.value).toEqual(
          call(fetchAPI, 'test/providers/917/containers')
        );
      });

      it('should return dispatch a reject status with an error', () => {
        result = saga.next({ data: {} });
        expect(result.value).toEqual(
          put({
            type: FETCH_PROVIDERCONTAINER_REJECTED,
            payload: { message: 'a provider was not found' },
          })
        );
      });
    });

    it('should dispatch a reject status when there is an error', () => {
      const provider = { id: '917', org: { properties: { fqon: 'test' } }, properties: {} };
      const sagaError = fetchContainer({ provider, providers });
      let resultError = sagaError.next();
      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: FETCH_PROVIDERCONTAINER_REJECTED, payload: error })
      );
    });
  });

  describe('handleSelectedProviderType workflow', () => {
    let result;
    const saga = handleSelectedProviderType({ fqon: 'root', providerType: { id: '435' } });

    it('should call the action to set the selected provider on the container to the default value', () => {
      result = saga.next();

      expect(result.value).toEqual(
        put(setSelectedProvider())
      );
    });

    it('should make an api call', () => {
      result = saga.next();
      expect(result.value).toEqual(
        call(fetchAPI, 'root/resourcetypes/435/schema?filter=config')
      );
    });

    it('should return a payload and dispatch a success status', () => {
      result = saga.next({ data: [{ name: 'PUBLIC', value: 'yup', public: true }, { name: 'PRIVATE', value: 'nope', public: false }] });
      expect(result.value).toEqual(
        put({
          type: SELECTED_PROVIDERTYPE_FULFILLED,
          payload: {
            selectedProviderType: { id: '435' },
            envSchema: { public: [{ name: 'PUBLIC', value: 'yup', public: true }], private: [{ name: 'PRIVATE', value: 'nope', public: false }] },
          }
        })
      );
    });

    it('should return a payload and dispatch a reject status when there is an error', () => {
      const sagaError = handleSelectedProviderType({ fqon: 'root', providerType: { id: '435' } });
      let resultError = sagaError.next();

      resultError = sagaError.throw({ message: error });

      expect(resultError.value).toEqual(
        put({ type: SELECTED_PROVIDERTYPE_REJECTED, payload: error })
      );
    });
  });

  describe('Provider workflow sagas', () => {
    let result;
    const rootSaga = providerSagas();

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

    it('should fork a watcher for fetchContainer', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        fork(watchContainerWorkflow)
      );
    });

    it('should fork a watcher for handleSelectedProviderType', () => {
      result = rootSaga.next();
      expect(result.value).toEqual(
        takeLatest(SELECTED_PROVIDERTYPE_REQUEST, handleSelectedProviderType)
      );
    });
  });
});

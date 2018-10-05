import { takeLatest, put, call, fork, cancelled, select, take, race } from 'redux-saga/effects';
import axios from 'axios';
import { sortBy } from 'lodash';
import { fetchAPI, poll } from 'config/lib/utility';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  INIT_PROVIDERCREATE_REQUEST,
  INIT_PROVIDERCREATE_FULFILLED,
  INIT_PROVIDERCREATE_REJECTED,
  INIT_PROVIDERCREATE_CANCELLED,
  INIT_PROVIDEREDIT_REQUEST,
  INIT_PROVIDEREDIT_FULFILLED,
  INIT_PROVIDEREDIT_REJECTED,
  INIT_PROVIDEREDIT_CANCELLED,
  SELECTED_PROVIDERTYPE_REQUEST,
  SELECTED_PROVIDERTYPE_FULFILLED,
  SELECTED_PROVIDERTYPE_REJECTED,
  FETCH_PROVIDERCONTAINER_REQUEST,
  FETCH_PROVIDERCONTAINER_FULFILLED,
  FETCH_PROVIDERCONTAINER_REJECTED,
  UNLOAD_PROVIDER,
} from '../constants';
import { FETCH_CONTEXT_FULFILLED } from '../../Hierarchy/constants';
import { generateResourceTypeSchema } from '../lists/providerTypes';
import providerModel from '../models/provider';
import { setSelectedProvider } from '../../Containers/actions';
import containerModel from '../../Containers/models/container';

function generateProvidersRequest(context) {
  switch (context.contextMeta.context) {
    case 'environment':
      return axios.get(`${context.environment.org.properties.fqon}/environments/${context.environment.id}/providers?expand=true`);
    case 'workspace':
      return axios.get(`${context.workspace.org.properties.fqon}/workspaces/${context.workspace.id}/providers?expand=true`);
    default:
      return axios.get(`${context.organization.properties.fqon}/providers?expand=true`);
  }
}

/**
 * fetchContainer
 * @param {*} action - { provider, providers }
 */
export function* fetchContainer(action) {
  try {
    const containers = yield call(fetchAPI, `${action.provider.org.properties.fqon}/providers/${action.provider.id}/containers`);

    if (containers.data.length) {
      const container = yield call(fetchAPI, `${action.provider.org.properties.fqon}/containers/${containers.data[0].id}?embed=provider&embed=volumes`);
      yield put(setSelectedProvider(container.data.properties.provider));
      yield put({ type: FETCH_PROVIDERCONTAINER_FULFILLED, payload: container.data, action });
    } else {
      // Ugh fallback
      const selectedProvider = action.providers
        .find(p => p.id === providerModel.get(action.provider).properties.services[0].container_spec.properties.provider.id);
      if (selectedProvider && selectedProvider.id) {
        yield put(setSelectedProvider(selectedProvider));
        yield put({ type: FETCH_PROVIDERCONTAINER_FULFILLED, payload: containerModel.get(), action });
      } else {
        yield put({ type: FETCH_PROVIDERCONTAINER_REJECTED, payload: { message: 'a provider was not found' } });
      }
    }
  } catch (e) {
    yield put({ type: FETCH_PROVIDERCONTAINER_REJECTED, payload: e.message });
  }
}

export function* createViewWorkflow() {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.completed))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const context = yield select(state => state.hierarchy.context);

    const [resourceTypes, providers] = yield call(axios.all, [
      axios.get(`${context.organization.properties.fqon}/resourcetypes?expand=true&type=Gestalt::Configuration::Provider`),
      generateProvidersRequest(context),
    ]);

    yield put({
      type: INIT_PROVIDERCREATE_FULFILLED,
      payload: {
        resourceTypes: generateResourceTypeSchema(resourceTypes.data),
        providers: providers.data,
      },
    });
  } catch (e) {
    yield put({ type: INIT_PROVIDERCREATE_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_PROVIDERCREATE_CANCELLED });
    }
  }
}

export function* editViewWorkflow(action) {
  const { providerId } = action;

  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.completed))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const context = yield select(state => state.hierarchy.context);

    const [provider, providers] = yield call(axios.all, [
      axios.get(`${context.organization.properties.fqon}/providers/${providerId}`),
      generateProvidersRequest(context),
    ]);

    const selectedResource = yield call(fetchAPI, `${context.organization.properties.fqon}/resourcetypes?expand=true&type=${provider.data.resource_type}`);
    const selectedProviderType = generateResourceTypeSchema(selectedResource.data)[0];

    const payload = {
      provider: provider.data,
      providers: providers.data,
      selectedProviderType,
    };

    if (selectedProviderType.allowContainer) {
      yield call(fetchContainer, { provider: provider.data, providers: providers.data });
    }

    yield put({
      type: INIT_PROVIDEREDIT_FULFILLED,
      // pass this back in for polling
      action: { ...action, provider: provider.data, providers: providers.data },
      payload,
    });
  } catch (e) {
    yield put({ type: INIT_PROVIDEREDIT_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_PROVIDEREDIT_CANCELLED });
    }
  }
}

export function* handleSelectedProviderType(action = {}) {
  try {
    // TODO: until we refactor container providers this needs to happend to clear out the selectedprovider state on the containe redux state
    // we can also consider breaking down the container form into smaller components and rebuilding it here
    // Clear out any container state
    yield put(setSelectedProvider());

    const response = yield call(fetchAPI, `${action.fqon}/resourcetypes/${action.providerType.id}/schema?filter=config`);

    const envSchema = {
      public: sortBy(response.data.filter(item => item.public === true), [v => v.name.toLowerCase()]),
      private: sortBy(response.data.filter(item => item.public === false), [v => v.name.toLowerCase()]),
    };

    const payload = {
      selectedProviderType: action.providerType,
      envSchema,
    };

    yield put({ type: SELECTED_PROVIDERTYPE_FULFILLED, payload });
  } catch (e) {
    yield put({ type: SELECTED_PROVIDERTYPE_REJECTED, payload: e.message });
  }
}

/* Note: to deal with RACE conditions when a user is navigating too quickly and the INIT_PROVIDEREDIT_FULFILLED (starts poll)
 channel happens after the UNLOAD_PROVIDER (cancels poll), we need a failsafe to stop polling as soon as possible.
 Here we use LOCATION_CHANGE so on any subsequent nav the polling is cancelled and the container state unloaded again.
 This is a stop gap until we have real events that negate short polling */
function* watchContainerPoll() {
  while (true) {
    const { action } = yield take(FETCH_PROVIDERCONTAINER_FULFILLED);

    yield race({
      task: call(poll, fetchContainer, action),
      cancel: take(UNLOAD_PROVIDER),
      cancelled: take(INIT_PROVIDEREDIT_CANCELLED),
      cancelRoute: take(LOCATION_CHANGE),
    });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, INIT_PROVIDERCREATE_REQUEST, createViewWorkflow);
  yield fork(takeLatest, INIT_PROVIDEREDIT_REQUEST, editViewWorkflow);
  yield fork(takeLatest, FETCH_PROVIDERCONTAINER_REQUEST, fetchContainer);
  yield fork(takeLatest, SELECTED_PROVIDERTYPE_REQUEST, handleSelectedProviderType);
  yield fork(watchContainerPoll);
}

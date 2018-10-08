import { takeLatest, put, call, fork, cancelled, select, take, race } from 'redux-saga/effects';
import axios from 'axios';
import { convertFromMaps } from 'util/helpers/transformations';
import {
  INIT_CONTAINERCREATE_REQUEST,
  INIT_CONTAINERCREATE_FULFILLED,
  INIT_CONTAINERCREATE_REJECTED,
  INIT_CONTAINERCREATE_CANCELLED,
  INIT_CONTAINEREDIT_REQUEST,
  INIT_CONTAINEREDIT_FULFILLED,
  INIT_CONTAINEREDIT_REJECTED,
  INIT_CONTAINEREDIT_CANCELLED,
  UNLOAD_CONTAINER,
} from '../constants';
import { FETCH_CONTEXT_FULFILLED } from '../../Hierarchy/constants';
import { setSelectedProvider } from '../actions';

export function* createViewWorkflow() {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const [providers, volumes, secrets] = yield call(axios.all, [
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/providers?expand=true&type=CaaS`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/secrets?expand=true`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/volumes?expand=true`),
    ]);

    yield put({
      type: INIT_CONTAINERCREATE_FULFILLED,
      payload: {
        providers: providers.data,
        secrets: secrets.data,
        volumes: volumes.data,
      },
    });
  } catch (e) {
    yield put({ type: INIT_CONTAINERCREATE_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_CONTAINERCREATE_CANCELLED });
    }
  }
}

export function* editViewWorkflow(action) {
  const { containerId } = action;

  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const [container, secrets, volumes] = yield call(axios.all, [
      axios.get(`${environment.org.properties.fqon}/containers/${containerId}?embed=provider`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/secrets?expand=true`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/volumes?expand=true`),
    ]);

    const envResponse = yield call(axios.get, `${environment.org.properties.fqon}/environments/${environment.id}/env`);
    const payload = { ...container.data };
    payload.properties.env = convertFromMaps(container.data.properties.env, envResponse.data);

    yield put(setSelectedProvider(payload.properties.provider));

    yield put({
      type: INIT_CONTAINEREDIT_FULFILLED,
      // TODO: refactor out this entity crap
      // we need action to be passed for the polling function
      action: { ...action, fqon: environment.org.properties.fqon, entityKey: 'environments', entityId: environment.id },
      payload: {
        secrets: secrets.data,
        volumes: volumes.data,
        container: payload,
      },
    });
  } catch (e) {
    yield put({ type: INIT_CONTAINEREDIT_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_CONTAINEREDIT_CANCELLED });
    }
  }
}

// Kicks off the Workflow but can be cancelled by any event in the race
export function* watchCreateViewWorkflow() {
  yield takeLatest(INIT_CONTAINERCREATE_REQUEST, function* raceCreate(...args) {
    yield race({
      task: call(createViewWorkflow, ...args),
      cancel: take(UNLOAD_CONTAINER),
      // cancelRoute: take(LOCATION_CHANGE),
    });
  });
}


// Kicks off the Workflow but can be cancelled by any event in the race
export function* watchEditViewWorkflow() {
  yield takeLatest(INIT_CONTAINEREDIT_REQUEST, function* raceEdit(...args) {
    yield race({
      task: call(editViewWorkflow, ...args),
      cancel: take(UNLOAD_CONTAINER),
      // cancelRoute: take(LOCATION_CHANGE),
    });
  });
}

// Watchers
export default function* () {
  yield fork(watchCreateViewWorkflow);
  yield fork(watchEditViewWorkflow);
}

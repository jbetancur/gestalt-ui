import { takeLatest, put, call, fork, cancelled, select, take, race } from 'redux-saga/effects';
import axios from 'axios';
import {
  INIT_STREAMSPECCREATE_REQUEST,
  INIT_STREAMSPECCREATE_FULFILLED,
  INIT_STREAMSPECCREATE_REJECTED,
  INIT_STREAMSPECCREATE_CANCELLED,
  INIT_STREAMSPECEDIT_REQUEST,
  INIT_STREAMSPECEDIT_FULFILLED,
  INIT_STREAMSPECEDIT_REJECTED,
  INIT_STREAMSPECEDIT_CANCELLED,
  UNLOAD_STREAMSPEC,
} from '../constants';
import { FETCH_CONTEXT_FULFILLED } from '../../Hierarchy/constants';

export function* createViewWorkflow() {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const [providers, datafeeds, lambdas] = yield call(axios.all, [
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/providers?expand=true&type=StreamProvider`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/datafeeds?expand=true`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/lambdas?expand=true`),
    ]);

    yield put({
      type: INIT_STREAMSPECCREATE_FULFILLED,
      payload: {
        providers: providers.data,
        datafeeds: datafeeds.data,
        lambdas: lambdas.data.filter(l => l.properties && l.properties.runtime && (l.properties.runtime === 'java' || l.properties.runtime === 'java;scala')),
      },
    });
  } catch (e) {
    yield put({ type: INIT_STREAMSPECCREATE_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_STREAMSPECCREATE_CANCELLED });
    }
  }
}

export function* editViewWorkflow(action) {
  const { streamSpecId } = action;

  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const [streamSpec, providers, datafeeds, lambdas, actions] = yield call(axios.all, [
      axios.get(`${environment.org.properties.fqon}/streamspecs/${streamSpecId}`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/providers?expand=true&type=StreamProvider`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/datafeeds?expand=true`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/lambdas?expand=true`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/actions?expand=true&filter=streamspec.edit&filter=streamspec.instances`),
    ]);

    const streamActions = actions.data.length
      ? actions.data
        .filter(a => a.locations || a.properties.ui_locations
          .some(loc => loc === 'streamspec.edit'))
      : [];

    const streamInstanceActions = actions.data.length
      ? actions.data
        .filter(a => a.locations || a.properties.ui_locations
          .some(loc => loc === 'streamspec.instances'))
      : [];

    yield put({
      type: INIT_STREAMSPECEDIT_FULFILLED,
      payload: {
        streamSpec: streamSpec.data,
        providers: providers.data,
        datafeeds: datafeeds.data,
        lambdas: lambdas.data
          .filter(l => l.properties && l.properties.runtime && (l.properties.runtime === 'java' || l.properties.runtime === 'java;scala')),
        actions: streamActions,
        instanceActions: streamInstanceActions,
      },
    });
  } catch (e) {
    yield put({ type: INIT_STREAMSPECEDIT_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_STREAMSPECEDIT_CANCELLED });
    }
  }
}


// Kicks off the Workflow but can be cancelled by any event in the race
export function* watchCreateViewWorkflow() {
  yield takeLatest(INIT_STREAMSPECCREATE_REQUEST, function* raceCreate(...args) {
    yield race({
      task: call(createViewWorkflow, ...args),
      cancel: take(UNLOAD_STREAMSPEC),
    });
  });
}


// Kicks off the Workflow but can be cancelled by any event in the race
export function* watchEditViewWorkflow() {
  yield takeLatest(INIT_STREAMSPECEDIT_REQUEST, function* raceEdit(...args) {
    yield race({
      task: call(editViewWorkflow, ...args),
      cancel: take(UNLOAD_STREAMSPEC),
    });
  });
}

// Watchers
export default function* () {
  yield fork(watchCreateViewWorkflow);
  yield fork(watchEditViewWorkflow);
}

import { takeLatest, put, call, fork, cancelled, select, take, race } from 'redux-saga/effects';
import axios from 'axios';
import { mapTo2DArray, } from 'util/helpers/transformations';
import { notificationActions } from 'Modules/Notifications';
import { fetchAPI } from 'config/lib/utility';
import {
  FETCH_LAMBDAS_REQUEST,
  FETCH_LAMBDAS_FULFILLED,
  FETCH_LAMBDAS_REJECTED,
  FETCH_LAMBDAS_CANCELLED,
  CREATE_LAMBDA_REQUEST,
  CREATE_LAMBDA_FULFILLED,
  CREATE_LAMBDA_REJECTED,
  UPDATE_LAMBDA_REQUEST,
  UPDATE_LAMBDA_FULFILLED,
  UPDATE_LAMBDA_REJECTED,
  DELETE_LAMBDAS_REQUEST,
  DELETE_LAMBDA_REQUEST,
  DELETE_LAMBDA_FULFILLED,
  DELETE_LAMBDA_REJECTED,
  INIT_LAMBDACREATE_REQUEST,
  INIT_LAMBDACREATE_FULFILLED,
  INIT_LAMBDACREATE_REJECTED,
  INIT_LAMBDACREATE_CANCELLED,
  INIT_LAMBDAEDIT_REQUEST,
  INIT_LAMBDAEDIT_FULFILLED,
  INIT_LAMBDAEDIT_REJECTED,
  INIT_LAMBDAEDIT_CANCELLED,
  UNLOAD_LAMBDA,
} from '../actionTypes';
import { FETCH_CONTEXT_FULFILLED } from '../../Hierarchy/actionTypes';

/**
 * fetchLambdas
 * @param {*} action { fqon, environmentId }
 */
export function* fetchLambdas(action) {
  try {
    const url = action.environmentId ? `${action.fqon}/environments/${action.environmentId}/lambdas` : `${action.fqon}/lambdas`;
    const response = yield call(fetchAPI, `${url}?expand=true&embed=apiendpoints&embed=provider`);

    yield put({ type: FETCH_LAMBDAS_FULFILLED, payload: response.data });
  } catch (e) {
    yield put({ type: FETCH_LAMBDAS_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: FETCH_LAMBDAS_CANCELLED });
    }
  }
}

/**
 * createLambda
 * @param {*} action - { fqon, environmentId, payload, onSuccess {returns response.data} }
 */
export function* createLambda(action) {
  try {
    const { data } = yield call(axios.post, `${action.fqon}/environments/${action.environmentId}/lambdas?embed=provider`, action.payload);

    yield put({ type: CREATE_LAMBDA_FULFILLED, payload: data });
    yield put(notificationActions.addNotification({ message: `${data.name} Lambda created` }));
    if (typeof action.onSuccess === 'function') {
      action.onSuccess(data);
    }
  } catch (e) {
    yield put({ type: CREATE_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * updateLambda
 * @param {*} action - { fqon, lambdaId, payload, onSuccess {returns response.data}  }
 */
export function* updateLambda(action) {
  try {
    const { data } = yield call(axios.patch, `${action.fqon}/lambdas/${action.lambdaId}?embed=provider`, action.payload);
    // On a patch resource we still need to pull in the inheritied envs so we can reconcile them
    const envResponse = yield call(axios.get, `${data.properties.parent.href}/env`);

    const payload = {
      lambda: data,
      inheritedEnv: envResponse.data,
    };

    yield put({ type: UPDATE_LAMBDA_FULFILLED, payload });
    yield put(notificationActions.addNotification({ message: `${data.name} Lambda updated` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess(data);
    }
  } catch (e) {
    yield put({ type: UPDATE_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * deleteLambda
 * @param {*} action - { fqon, lambdaId, onSuccess }
 */
export function* deleteLambda(action) {
  try {
    yield call(axios.delete, `${action.fqon}/lambdas/${action.resource.id}?force=${action.force || false}`);
    yield put({ type: DELETE_LAMBDA_FULFILLED, payload: action.resource });
    yield put(notificationActions.addNotification({ message: `${action.resource.name} Lambda deleted` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: DELETE_LAMBDA_REJECTED, payload: e.message });
  }
}

/**
 * deleteLambdas
 * @param {*} action - { fqon, lambdaIds, onSuccess }
 */
export function* deleteLambdas(action) {
  try {
    const all = action.resources.map(resource => axios.delete(`${action.fqon}/lambdas/${resource.id}?force=${action.force || false}`));
    const names = action.resources.map(item => (item.name)).join('\n');

    yield call(axios.all, all);
    yield put({ type: DELETE_LAMBDA_FULFILLED, payload: action.resources });
    yield put(notificationActions.addNotification({ message: `${names} lambdas deleted` }));

    if (typeof action.onSuccess === 'function') {
      action.onSuccess();
    }
  } catch (e) {
    yield put({ type: DELETE_LAMBDA_REJECTED, payload: e.message });
  }
}

export function* createViewWorkflow() {
  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const [providers, executors, secrets, env] = yield call(axios.all, [
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/providers?expand=true&type=Lambda`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/providers?expand=true&type=Executor`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/secrets?expand=true`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/env`),
    ]);

    yield put({
      type: INIT_LAMBDACREATE_FULFILLED,
      payload: {
        providers: providers.data,
        executors: executors.data,
        secrets: secrets.data,
        inheritedEnv: mapTo2DArray(env.data, 'name', 'value', { inherited: true }),
      },
    });
  } catch (e) {
    yield put({ type: INIT_LAMBDACREATE_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_LAMBDACREATE_CANCELLED });
    }
  }
}

export function* editViewWorkflow(action) {
  const { lambdaId } = action;

  try {
    // wait for context to be populated
    if (!(yield select(state => state.hierarchy.context.environment.id))) {
      yield take(FETCH_CONTEXT_FULFILLED);
    }

    const { environment } = yield select(state => state.hierarchy.context);

    const [lambda, executors, secrets] = yield call(axios.all, [
      axios.get(`${environment.org.properties.fqon}/lambdas/${lambdaId}?embed=provider`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/providers?expand=true&type=Executor`),
      axios.get(`${environment.org.properties.fqon}/environments/${environment.id}/secrets?expand=true`),
    ]);

    const envResponse = yield call(axios.get, `${lambda.data.properties.parent.href}/env`);

    yield put({
      type: INIT_LAMBDAEDIT_FULFILLED,
      payload: {
        executors: executors.data,
        secrets: secrets.data,
        lambda: lambda.data,
        inheritedEnv: envResponse.data,
      },
    });
  } catch (e) {
    yield put({ type: INIT_LAMBDAEDIT_REJECTED, payload: e.message });
  } finally {
    if (yield cancelled()) {
      yield put({ type: INIT_LAMBDAEDIT_CANCELLED });
    }
  }
}


// Kicks off the Workflow but can be cancelled by any event in the race
export function* watchCreateWorkflow() {
  yield takeLatest(INIT_LAMBDACREATE_REQUEST, function* raceCreate(...args) {
    yield race({
      task: call(createViewWorkflow, ...args),
      cancel: take(UNLOAD_LAMBDA),
      // cancelRoute: take(LOCATION_CHANGE),
    });
  });
}


// Kicks off the Workflow but can be cancelled by any event in the race
export function* watchEditViewWorkflow() {
  yield takeLatest(INIT_LAMBDAEDIT_REQUEST, function* raceEdit(...args) {
    yield race({
      task: call(editViewWorkflow, ...args),
      cancel: take(UNLOAD_LAMBDA),
      // cancelRoute: take(LOCATION_CHANGE),
    });
  });
}

// Watchers
export default function* () {
  yield takeLatest(FETCH_LAMBDAS_REQUEST, fetchLambdas);
  yield takeLatest(CREATE_LAMBDA_REQUEST, createLambda);
  yield takeLatest(UPDATE_LAMBDA_REQUEST, updateLambda);
  yield takeLatest(DELETE_LAMBDA_REQUEST, deleteLambda);
  yield takeLatest(DELETE_LAMBDAS_REQUEST, deleteLambdas);
  yield fork(watchCreateWorkflow);
  yield fork(watchEditViewWorkflow);
}

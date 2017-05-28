import { takeLatest, put, call, fork } from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actionTypes';
import { LOGGING } from '../constants/resourceTypes';

/**
 * fetchLogProvider
 * @param {*} action { fqon, providerId, logType }
 */
export function* fetchLogProvider(action) {
  try {
    let logProviderRes = {};
    let caasProviderRes = {};
    let linkedLoggingProvider = {};

    if (action.logType === 'container') {
      // container -> caas_provider -> log_provider -> [SERVICE_HOST,SERVICE_PORT]
      caasProviderRes = yield call(axios.get, `${action.fqon}/providers/${action.providerId}`);
    } else if (action.logType === 'lambda') {
      // lambda -> lambda_provider -> META_COMPUTE_PROVIDER_ID -> caas_provider -> log_provider -> [SERVICE_HOST, SERVICE_PORT]
      const lambdaProviderRes = yield call(axios.get, `${action.fqon}/providers/${action.providerId}`);
      caasProviderRes = yield call(axios.get, `${action.fqon}/providers/${lambdaProviderRes.data.properties.config.env.public.META_COMPUTE_PROVIDER_ID}`);
    }

    // find the linked provider by typeId
    linkedLoggingProvider = caasProviderRes.data.properties.linked_providers.find(provider => provider.typeId === LOGGING);

    if (linkedLoggingProvider && linkedLoggingProvider.id) {
      logProviderRes = yield call(axios.get, `${action.fqon}/providers/${linkedLoggingProvider.id}`);

      const payload = {
        provider: logProviderRes.data,
        url: logProviderRes.data
          && logProviderRes.data.properties.config
          && logProviderRes.data.properties.config.env.public.SERVICE_VHOST_0
          ? `https://${logProviderRes.data.properties.config.env.public.SERVICE_VHOST_0}/${action.logType}` : '',
      };

      yield put({ type: types.FETCH_LOGPROVIDER_FULFILLED, payload });
    } else {
      yield put({ type: types.FETCH_LOGPROVIDER_REJECTED, payload: `The CAAS Provider ${caasProviderRes.data.name} is not Linked to a Log Provider` });
    }
  } catch (e) {
    yield put({ type: types.FETCH_LOGPROVIDER_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, types.FETCH_LOGPROVIDER_REQUEST, fetchLogProvider);
}

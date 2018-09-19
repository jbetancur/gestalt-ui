import { takeLatest, put, call, fork } from 'redux-saga/effects';
import { merge, cloneDeep } from 'lodash';
import { fetchAPI } from 'config/lib/utility';
import {
  FETCH_LOGPROVIDER_REQUEST,
  FETCH_LOGPROVIDER_FULFILLED,
  FETCH_LOGPROVIDER_REJECTED,
} from './constants';
import { LOGGING } from '../../constants';

/**
 * fetchLogProvider
 * @param {*} action { fqon, providerId, logType }
 */
export function* fetchLogProvider(action) {
  try {
    const model = Object.freeze({
      data: {
        properties: {
          config: {
            env: {
              public: {},
              private: {},
            }
          },
        }
      }
    });

    const caasProviderRes = cloneDeep(model);
    const linkedLoggingProvider = cloneDeep(model);
    const lambdaProviderRes = cloneDeep(model);
    let logProviderRes = {};

    if (action.logType === 'container') {
      // container -> caas_provider -> log_provider -> [SERVICE_HOST,SERVICE_PORT]
      merge(caasProviderRes, yield call(fetchAPI, `${action.fqon}/providers/${action.providerId}`));
    } else if (action.logType === 'lambda') {
      // lambda -> lambda_provider -> META_COMPUTE_PROVIDER_ID -> caas_provider -> log_provider -> [SERVICE_HOST, SERVICE_PORT]
      merge(lambdaProviderRes, yield call(fetchAPI, `${action.fqon}/providers/${action.providerId}`));
      if (lambdaProviderRes.data.properties.config.env.public.META_COMPUTE_PROVIDER_ID) {
        merge(caasProviderRes, yield call(fetchAPI, `${action.fqon}/providers/${lambdaProviderRes.data.properties.config.env.public.META_COMPUTE_PROVIDER_ID}`));
      } else {
        throw new Error('The Linked Lambda Provider is missing "properties.config.env.public.META_COMPUTE_PROVIDER_ID"');
      }
    }

    // find the linked provider by typeId
    if (caasProviderRes.data.properties.linked_providers && caasProviderRes.data.properties.linked_providers.length > 0) {
      merge(linkedLoggingProvider, caasProviderRes.data.properties.linked_providers.find(provider => provider.typeId === LOGGING));
    } else {
      throw new Error(`A Logging Provided does not appear to be Linked to ${caasProviderRes.data.name}`);
    }

    if (linkedLoggingProvider && linkedLoggingProvider.id) {
      logProviderRes = yield call(fetchAPI, `${action.fqon}/providers/${linkedLoggingProvider.id}`);
      const vHOSTUrl = logProviderRes.data.properties.config.env.public.SERVICE_VHOST_0;
      const vHOSTProtocol = logProviderRes.data.properties.config.env.public.SERVICE_VHOST_0_PROTOCOL || 'https';
      const payload = {
        provider: logProviderRes.data,
        url: vHOSTUrl ? `${vHOSTProtocol}://${vHOSTUrl}/${action.logType}` : '',
      };

      yield put({ type: FETCH_LOGPROVIDER_FULFILLED, payload });
    } else {
      throw new Error(`The CAAS Provider ${caasProviderRes.data.name} is not Linked to a Log Provider`);
    }
  } catch (e) {
    yield put({ type: FETCH_LOGPROVIDER_REJECTED, payload: e.message });
  }
}

// Watchers
export default function* () {
  yield fork(takeLatest, FETCH_LOGPROVIDER_REQUEST, fetchLogProvider);
}

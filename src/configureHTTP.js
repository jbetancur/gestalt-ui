import axios from 'axios';
import cookie from 'react-cookie';
import { API_URL, API_TIMEOUT } from './constants';

// Axios Defaults
axios.defaults.baseURL = API_URL;
axios.defaults.timeout = API_TIMEOUT;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

export default function configureInterceptors(store, history) {
  axios.interceptors.request.use((config) => {
    const newConfig = { ...config };

    store.dispatch({ type: 'app/APP_HTTP_REQUEST', activity: true });
    newConfig.headers.Authorization = `Bearer ${cookie.load('auth_token')}`;
    return newConfig;
  }, (error) => {
    store.dispatch({ type: 'app/APP_HTTP_REQUEST', activity: false });

    Promise.reject(error);
  });

  // Dispatch App Wide Errors via response interceptor for whatever component is listening
  axios.interceptors.response.use((config) => {
    store.dispatch({ type: 'app/APP_HTTP_REQUEST', activity: false });
    return config;
  }, (error) => {
    const validCookie = !!cookie.load('auth_token') || false;
    store.dispatch({ type: 'app/APP_HTTP_REQUEST', activity: false });

    if (!validCookie) {
      history.replace('/login');
    } else {
      const permissions = [
        'license.view',
        'org.view',
        'workspace.view',
        'environment.view',
        'lambda.view',
        'container.view',
        'policy.view',
        'api.view',
        'apiendpoint.view',
        'provider.view',
        'entitlement.view',
        'integration.view',
        'user.view',
        'group.view',
      ];

      const response = error.response.data;

      // TODO: Until we have a permissions prefetch API - for now Handle routing when context view permissions are thrown
      if (response.message) {
        // eslint-disable-next-line no-lonely-if
        if (response.message.includes('license.view')) {
          // Nothing for now
        } else if (response.code === 403 && permissions.some(entitlement => response.message.includes(entitlement))) {
          history.goBack();
        } else {
          store.dispatch({ type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response });
        }
      }

      // handle partial error messages - this is really just patch for dealing with sparse error handling from meta
      if (response.message) {
        // reroute to root if the context is no longer available
        if (response.message.includes('not found') &&
          response.code === 404) {
          history.replace('/');
        }

        // if someone decides to muck or paste a url with an invalid UUID
        if (response.message.includes('is not a valid v4 UUID') &&
          response.code === 400) {
          history.replace('/');
        }

        // handle if an environment is deleted and user is in environment context
        if (response.message.includes('UUID did not correspond to an environment') &&
          response.code === 400) {
          history.replace('/');
        }

        // default
        if (response.code === 404) {
          history.replace('/');
        }
      }
    }

    Promise.reject(error);
  });
}

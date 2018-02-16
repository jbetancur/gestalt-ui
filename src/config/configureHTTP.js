import axios from 'axios';
import Cookies from 'universal-cookie';
import { API_URL, API_TIMEOUT } from '../constants';

// Axios Defaults
axios.defaults.baseURL = API_URL;
axios.defaults.timeout = API_TIMEOUT;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

const cookies = new Cookies();

export default function configureInterceptors(store, history) {
  axios.interceptors.request.use((config) => {
    const newConfig = { ...config };
    newConfig.headers.Authorization = `Bearer ${cookies.get('auth_token')}`;

    return newConfig;
  }, error => Promise.reject(error));

  // Dispatch App Wide Errors via response interceptor for whatever component is listening
  axios.interceptors.response.use(config => config, (error) => {
    const validCookie = !!cookies.get('auth_token') || false;

    if (!validCookie) {
      // fall back for missing token & Eat any 401 errors
      history.replace('/login');
      store.dispatch({ type: 'auth/LOG_OUT' });

      return Promise.resolve();
    }

    const permissions = [
      'license.view',
      // 'org.view',
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
      'secret.view',
    ];

    const response = error.response.data;

    // "Robust" Fallback Routing -_-
    if (response.message && typeof response.message === 'string') {
      const fqon = store.getState().metaResource.self.self.properties.gestalt_home.properties.fqon;

      if ((response.code === 404 || response.code === 400) &&
        (response.message.includes('not found') ||
        response.message.includes('Resource with ID') ||
        response.message.includes('is not a valid v4 UUID') ||
          response.message.includes('Cannot parse parameter id as UUID')) &&
        // TODO: https://gitlab.com/galacticfog/gestalt-meta/issues/425
        !(response.message.includes('is corrupt') && response.message.includes('Provider with ID'))) {
        history.replace(`/${fqon}/404`);

        return Promise.reject(error);
      }

      if (response.message.includes('Org with FQON') && response.message.includes('not found')) {
        history.replace(`/${fqon}/404`);

        return Promise.reject(error);
      }

      // TODO: Until we have a permissions prefetch API - for now Handle routing when context view permissions are thrown
      // eslint-disable-next-line no-lonely-if
      if (response.message.includes('license.view')) {
        // Nothing for now
      } else if (response.message.includes('org.view')) {
        // eslint-disable-next-line no-alert
        window.confirm('You have not been entitled to this organization. Please contact your administrator');
      } else if (response.code === 403 && permissions.some(entitlement => response.message.includes(entitlement))) {
        history.replace(`/${fqon}/404`);
      } else {
        store.dispatch({ type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response });
      }
    }

    // The API kicks inconsistet errors - in this case response handle string errors
    if (response === 'code 403: Forbidden') {
      store.dispatch({ type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response });

      return Promise.reject(error);
    }

    return Promise.reject(error);
  });
}

/* eslint no-undef: 0 */
// These derive from webpack.config and are injected by the webpack DefinePlugin at runtime
export const API_URL = $$API_URL$$;
export const SEC_API_URL = $$SEC_API_URL$$;
export const API_TIMEOUT = $$API_TIMEOUT$$;
export const API_RETRIES = $$API_RETRIES$$;
export const UI_VERSION = $$UI_VERSION$$;
export const APP_TITLE = $$APP_TITLE$$;
export const LICENSE_EXP_THRESHOLD = $$LICENSE_EXP_THRESHOLD$$;
export const DEBUG = $$DEBUG$$;
export const DOCUMENTATION_URL = $$DOCUMENTATION_URL$$;
export const COMPANY_TITLE = $$COMPANY_TITLE$$;
export const COMPANY_URL = $$COMPANY_URL$$;
export const ANALYTICS_TRACKING = $$ANALYTICS_TRACKING$$;
export const ANALYTICS_TRACKING_ACCT = $$ANALYTICS_TRACKING_ACCT$$;
export const REQUIRE_HTTPS_COOKIE = $$REQUIRE_HTTPS_COOKIE$$;

// UI Redux Action Prefix
export const PREFIX = '@@gestalt/';

// General Enums - TODO: make dynamic (requires a resourceTypes call)
export const ORGANIZATION = '23ba3299-b04e-4c5c-9b3d-64939b22944e';
export const WORKSPACE = 'fa17bae4-1294-42cc-93cc-c4ead7dc0343';
export const ENVIRONMENT = '46b28076-9d94-4860-9aca-e8483a56d32c';
export const PROVIDER = '5542148a-5568-4df2-a411-4b6c7248bc83';
export const LAMBDA = 'e3a463fc-e51f-4166-8cec-3d9a54f7babd';
export const CONTAINER = '28cbf0e0-2c48-4589-85d5-df97a3a1f318';
export const API = 'df4bf8b5-170f-453e-9526-c37c898d96c9';
export const POLICY = 'c3c05a39-acb3-4a45-97a8-5696ad1b4214';
export const VOLUME = '24361db7-0fc0-4be5-9973-d88d5602956f';
export const STREAMSPEC = 'e9e90e0a-4f87-492e-afcc-2cd84057f226';
export const SECRET = '98d8a6d6-e3db-488f-b32d-8b00b3fce472';
export const DATAFEED = '8f875ffc-69ff-48c8-9d6d-f3622b7b1062';
export const APPDEPLOYMENT = 'e97d8674-848a-487e-b640-823fdc39fa10';
export const USER = '58b6775d-37a5-44bc-9115-7331fc4964b7';
export const GROUP = 'ad4c7258-1896-45bf-8ec8-c875dcc7654e';
export const LOGGING = 'e1782fef-4b7c-4f75-b8b8-6e6e2ecd82b2';
export const DATA_CLASSIFICATION = '4f9a4d64-513c-4f2f-a372-8a90dd41de31';

export const routeKeys = {
  [PROVIDER]: 'providers',
  [LAMBDA]: 'lambdas',
  [CONTAINER]: 'containers',
  [API]: 'apis',
  [POLICY]: 'policies',
  [VOLUME]: 'volumes',
  [STREAMSPEC]: 'streamspecs',
  [SECRET]: 'secrets',
  [DATAFEED]: 'datafeeds',
  [APPDEPLOYMENT]: 'appdeployments',
  [USER]: 'users',
  [GROUP]: 'groups',
};

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

// General Enums - TODO: make dynamic (requires a resourceTypes call)
export const USER = '58b6775d-37a5-44bc-9115-7331fc4964b7';
export const GROUP = 'ad4c7258-1896-45bf-8ec8-c875dcc7654e';
export const LOGGING = 'e1782fef-4b7c-4f75-b8b8-6e6e2ecd82b2';
export const DATA_CLASSIFICATION = '4f9a4d64-513c-4f2f-a372-8a90dd41de31';

export default {
  USER,
  GROUP,
  LOGGING,
  DATA_CLASSIFICATION,
};

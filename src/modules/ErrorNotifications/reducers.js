
const initialState = {
  friendlyMessage: '',
  error: {
    data: {}
  }
};

export default (state = initialState, action) => {
  // Catch all REJECTIONS
  if (action.type.includes('REJECTED')) {
    // TODO: axios bug on failed promise
    if (action.payload.message && action.payload.message === 'Cannot read property \'data\' of undefined') {
      return state;
    }

    return {
      ...state,
      friendlyMessage: 'An Application Error Occured',
      error: action.payload || 'Unknown'
    };
  }

  // Handle Global state errors
  switch (action.type) {
    case 'APP_HTTP_ERROR_404':
      return {
        ...state,
        friendlyMessage: 'API path not found',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_401':
      return {
        ...state,
        friendlyMessage: 'Either you are unauthorized or you have navigated to an organization that no longer exists',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_500':
      return {
        ...state,
        friendlyMessage: 'Server error occured',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_403':
      return {
        ...state,
        friendlyMessage: 'Forbidden',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_409':
      return {
        ...state,
        friendlyMessage: 'Conflict',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_406':
      return {
        ...state,
        friendlyMessage: 'License has expired',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_400':
      return {
        ...state,
        friendlyMessage: 'Bad Request',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_415':
      return {
        ...state,
        friendlyMessage: 'Unsupported Media Type',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_503':
      return {
        ...state,
        friendlyMessage: 'Service Unavailable',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_504':
      return {
        ...state,
        friendlyMessage: 'Gateway Time-Out',
        error: action.payload
      };
    case 'APP_HTTP_ERROR_422':
      return {
        ...state,
        friendlyMessage: 'Unprocessable Entity',
        error: action.payload
      };
    case 'license/LICENSE_EXPIRING':
      return {
        ...state,
        friendlyMessage: 'License Expiration',
        error: action.payload
      };
    case 'license/LICENSE_EXPIRED':
      return {
        ...state,
        friendlyMessage: 'License Expired',
        error: action.payload
      };
    case 'APP_ERROR_GENERAL':
      return {
        ...state,
        friendlyMessage: '',
        error: action.payload
      };
    default:
      return state;
  }
};


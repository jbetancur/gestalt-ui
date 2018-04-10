
export default function createAction(type, payloadCreators) {
  const requestType = `${type}_REQUEST`;
  const successType = `${type}_SUCCESS`;
  const failureType = `${type}_FAILURE`;

  return {
    types: { request: requestType, success: successType, failure: failureType },
    request(...args) {
      return {
        type: requestType,
        payload: payloadCreators.request(...args),
      };
    },
    success(...args) {
      return {
        type: successType,
        payload: payloadCreators.success(...args),
      };
    },
    failure(errorMsg) {
      if (payloadCreators.failure) {
        return {
          type: failureType,
          payload: payloadCreators.failure(errorMsg),
        };
      }

      return errorMsg;
    },
  };
}

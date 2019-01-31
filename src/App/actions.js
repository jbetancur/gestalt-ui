export function showAppError(error) {
  return {
    type: `APP_HTTP_ERROR_${error.response.status}`, payload: error.response,
  };
}

export default {
  showAppError,
};

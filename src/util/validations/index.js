export function isFQON(string) {
  return /^[a-z0-9]+(-[a-z0-9]+)*[a-z0-9]*$/i.test(string);
}

export function isEnvironmentName(string) {
  return /^(([a-z0-9]|[a-z0-9][a-z0-9\\-]*[a-z0-9])\\.)*([a-z0-9]|[a-z0-9][a-z0-9\\-]*[a-z0-9])|(\\.|\\.\\.)$/i.test(string);
}

export function isWorkspaceName(string) {
  return /^(([a-z0-9]|[a-z0-9][a-z0-9\\-]*[a-z0-9])\\.)*([a-z0-9]|[a-z0-9][a-z0-9\\-]*[a-z0-9])|(\\.|\\.\\.)$/i.test(string);
}

export function isPhoneNumber(string) {
  return /^\+\d([. -]?\d){9,14}$/.test(string);
}

export function isUsername(string) {
  return /^[a-z0-9]+(-[a-z0-9]+)*[a-z0-9]*$/.test(string);
}

export function isBase64(string) {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
}

export function isLambdaName(string) {
  return /^\S*$/.test(string);
}

export default {
  isFQON,
  isWorkspaceName,
  isEnvironmentName,
  isPhoneNumber,
  isUsername,
  isBase64,
  isLambdaName
};

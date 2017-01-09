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

export default {
  isFQON,
  isWorkspaceName,
  isEnvironmentName,
  isPhoneNumber,
  isUsername
};

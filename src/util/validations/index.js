import yaml from 'js-yaml';

export const fqonPattern = /^[a-z0-9]+(-[a-z0-9]+)*[a-z0-9]*$/;
export const phoneNumberPattern = /^\+\d([. -]?\d){9,14}$/;
export const usernamePattern = /^[a-z0-9]+([-._][a-z0-9]+)*[a-z0-9]*$/;
export const lambdaNamePattern = /^\S*$/;
export const containerNamePattern = /^[a-z0-9]+(-[a-z0-9]+)*[a-z0-9]*$/;
export const containerServicePortNamePattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])*$/;
export const commaDelimitedPattern = /^((([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9]))?(,((([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])))*$/;
export const commaDelimitedConstraintsPattern = /^(([a-zA-Z0-9-_]+):(LIKE|UNLIKE|UNIQUE|CLUSTER|GROUP_BY|MAX_PER)(:[a-zA-Z0-9-_]+)?)(,[ ]*([a-zA-Z0-9-_]+):(LIKE|UNLIKE|UNIQUE|CLUSTER|GROUP_BY|MAX_PER)(:[a-zA-Z0-9-_]+)?)*$/;
export const kubernetesVolumeNamePattern = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
export const unixVariablePattern = /^[a-zA-Z_]+[a-zA-Z0-9_.-]*$/;
export const secretKeyValidationPattern = /^[-._a-zA-Z0-9]+$/;
export const secretNameValidationPattern = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
// eslint-disable-next-line no-useless-escape
export const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

/**
 * doValidation
 * @param {String} string
 * @param {regex} pattern
 * @param {Boolean} trim
 */
function doValidation(string, pattern, trim) {
  if (typeof string !== 'string' || !pattern) {
    return string;
  }

  if (trim) {
    const trimmedString = string.replace(/[\s,]+/g, ',');

    return pattern.test(trimmedString);
  }

  return pattern.test(string);
}

export const isFQON = string => doValidation(string, fqonPattern);
export const isPhoneNumber = string => doValidation(string, phoneNumberPattern);
export const isUsername = string => doValidation(string, usernamePattern);
export const isLambdaName = string => doValidation(string, lambdaNamePattern);
export const isContainerName = string => doValidation(string, containerNamePattern);
export const isContainerServicePortName = string => doValidation(string, containerServicePortNamePattern);
export const isCommaDelimited = string => doValidation(string, commaDelimitedPattern, true);
export const isCommaDelimitedConstraints = string => doValidation(string, commaDelimitedConstraintsPattern, true);
export const isKubernetesVolumeName = string => doValidation(string, kubernetesVolumeNamePattern);
export const isUnixVariable = string => doValidation(string, unixVariablePattern);
export const isSecretKeyValidation = string => doValidation(string, secretKeyValidationPattern);
export const isSecretNameValidation = string => doValidation(string, secretNameValidationPattern);
export const isBase64 = string => doValidation(string, base64Pattern);

export const isYAML = (yamlContent) => {
  try {
    yaml.safeLoad(yamlContent);
    return true;
  } catch (e) {
    return false;
  }
};

export default {
  isFQON,
  isPhoneNumber,
  isUsername,
  isLambdaName,
  isContainerName,
  isContainerServicePortName,
  isCommaDelimited,
  isKubernetesVolumeName,
  isUnixVariable,
  isSecretKeyValidation,
  isSecretNameValidation,
  fqonPattern,
  phoneNumberPattern,
  usernamePattern,
  lambdaNamePattern,
  containerNamePattern,
  containerServicePortNamePattern,
  commaDelimitedPattern,
  commaDelimitedConstraintsPattern,
  kubernetesVolumeNamePattern,
  unixVariablePattern,
  secretKeyValidationPattern,
  secretNameValidationPattern,
  isBase64,
  isYAML,
};

import queryString from 'query-string';

const buildParams = (baseURL, params) => (params ? `${baseURL}?${queryString.stringify(params)}` : baseURL);

/**
 * Generates a dynamic meta URL for array listing
 * @param {*} entity
 * @param {*} config
 */
export const buildAllURL = (entity, config, expand) => {
  let baseURL;

  const params = expand ? Object.assign({ expand: true }, config.params) : config.params;

  if (config.fqon) {
    baseURL = config.entityId && config.entityKey ? `${config.fqon}/${config.entityKey}/${config.entityId}/${entity}` : `${config.fqon}/${entity}`;
  } else {
    baseURL = entity;
  }

  return buildParams(baseURL, params);
};

/**
 * Generates a dynamic meta URL for object find
 * @param {*} entity
 * @param {*} config
 */
export const buildOneURL = (entity, config) => {
  let baseURL;

  if (config.fqon) {
    baseURL = `${config.fqon}/${entity}/${config.id}`;
  } else {
    baseURL = entity;
  }

  return buildParams(baseURL, config.params);
};

export default {
  buildAllURL,
  buildOneURL,
};

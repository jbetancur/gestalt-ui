import queryString from 'query-string';

/**
 * builds a valid url with query strings
 */
export const buildParams = (baseURL, params) => (params ? `${baseURL}?${queryString.stringify(params)}` : baseURL);

/**
 * Generates a dynamic meta URL for array listing
 * @param {*} entity
 * @param {*} config
 */
export const buildAllURL = (entity, config, expand) => {
  const params = expand ? Object.assign({ expand: true }, config.params) : config.params;

  // e.g /fqon style requests
  if (!entity) {
    return buildParams(config.fqon, params);
  }

  // e.g /fqon/workspaces  style requests with an entity
  if (config.fqon && entity) {
    const baseURL = config.entityId && config.entityKey ? `${config.fqon}/${config.entityKey}/${config.entityId}/${entity}` : `${config.fqon}/${entity}`;
    return buildParams(baseURL, params);
  }

  return buildParams(entity, params);
};

/**
 * Generates a dynamic meta URL for object find
 * @param {*} entity
 * @param {*} config
 */
export const buildOneURL = (entity, config) => {
  if (!entity) {
    return buildParams(config.fqon, config.params);
  }

  if (config.fqon && entity) {
    const baseURL = `${config.fqon}/${entity}/${config.id}`;
    return buildParams(baseURL, config.params);
  }

  return buildParams(entity, config.params);
};

export default {
  buildParams,
  buildAllURL,
  buildOneURL,
};

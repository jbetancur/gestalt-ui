import { isJSON } from 'validator';

export const nameMaxLen = 30;

export default (values) => {
  const errors = {
    properties: {
      config: {
        auth: {
          scheme: '',
          username: '',
          password: ''
        },
        networks: '',
        extra: '',
        url: '',
      },
      locations: [],
      parent: {}
    }
  };

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (!values.resource_type) {
    errors.resource_type = 'provider type is required';
  }

  if (!values.properties.config.url) {
    errors.properties.config.url = 'provider url is required';
  }

  if (!values.properties.config.auth.scheme) {
    errors.properties.config.auth.scheme = 'security scheme is required';
  }

  if (!values.properties.config.auth.username) {
    errors.properties.config.auth.username = 'username is required';
  }

  if (!values.properties.config.auth.password) {
    errors.properties.config.auth.password = 'password is required';
  }

  if (values.properties.config.networks && !isJSON(values.properties.config.networks)) {
    errors.properties.config.networks = 'networks must be valid JSON';
  }

  if (values.properties.config.extra) {
    // hack to deal with just a "string"" that we want to set on extra, but still treat validation as JSON
    if (!isJSON(values.properties.config.extra)) {
      try {
        JSON.parse(values.properties.config.extra);
      } catch (e) {
        errors.properties.config.extra = 'extra config must be valid JSON';
      }
    }
  }

  return errors;
};

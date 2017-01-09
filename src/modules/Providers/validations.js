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
        networks: [],
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

  return errors;
};

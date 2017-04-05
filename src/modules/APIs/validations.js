export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {
      provider: {},
    }
  };

  if (values.properties.provider && !values.properties.provider.id) {
    errors.properties.provider.id = 'a provider is required';
  }

  if (values.properties.provider && !values.properties.provider.location) {
    errors.properties.provider.location = 'a location is required';
  }

  if (!values.name) {
    errors.name = 'name is required';
  }

  return errors;
};

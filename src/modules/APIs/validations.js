import { isContainerName } from 'util/validations';

export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {
      provider: {},
    }
  };

  // if (values.properties.provider && !values.properties.provider.id) {
  //   errors.properties.provider.id = 'a gateway manager provider is required';
  // }

  if (values.properties.provider && !values.properties.provider.locations) {
    errors.properties.provider.locations = 'a kong provider type is required';
  }

  if (!values.name) {
    errors.name = 'name is required';
  }

  if (values.name && !isContainerName(values.name)) {
    errors.name = 'invalid api name format';
  }

  return errors;
};

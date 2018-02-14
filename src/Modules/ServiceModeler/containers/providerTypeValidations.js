export default (values) => {
  const errors = {
    properties: {
      provider_def: {}
    }
  };

  if (!values.name) {
    errors.name = 'required';
  }

  if (values.name && values.name.indexOf(' ') >= 0) {
    errors.name = 'spaces not allowed';
  }

  if (!values.properties.provider_def.name) {
    errors.properties.provider_def.name = 'required';
  }

  if (values.properties.provider_def.name && values.properties.provider_def.name.indexOf(' ') >= 0) {
    errors.properties.provider_def.name = 'spaces not allowed';
  }

  if (!values.properties.provider_def.extend) {
    errors.properties.provider_def.extend = 'required';
  }

  return errors;
};

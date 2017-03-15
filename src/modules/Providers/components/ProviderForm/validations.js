import { isJSON } from 'validator';

export const nameMaxLen = 45;

export default (values) => {
  const errors = {
    properties: {
      config: {
        auth: {
          scheme: '',
          username: '',
          password: ''
        },
        url: '',
        env: {
          public: '',
          private: '',
        },
        networks: '',
        extra: '',
      },
      linked_providers: {
        name: '',
        id: '',
      },
      locations: [],
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
  if (values.properties.config.auth && !values.properties.config.auth.scheme) {
    errors.properties.config.auth.scheme = 'security scheme is required';
  }
  if (values.properties.config.auth && !values.properties.config.auth.username) {
    errors.properties.config.auth.username = 'username is required';
  }
  if (values.properties.config.auth && !values.properties.config.auth.password) {
    errors.properties.config.auth.password = 'password is required';
  }

  if (values.properties.config.networks && !isJSON(values.properties.config.networks)) {
    errors.properties.config.networks = 'networks must be valid JSON';
  }

  if (!values.properties.data) {
    errors.properties.data = 'you must provide a yaml configuration';
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

  if (values.privateVariables && values.privateVariables.length) {
    const variablesArrayErrors = [];
    values.privateVariables.forEach((member, memberIndex) => {
      const memberErrors = {};

      if (!member || !member.name) {
        memberErrors.name = 'name is required';
        variablesArrayErrors[memberIndex] = memberErrors;
      }

      if (!member || !member.value) {
        memberErrors.value = 'value is required';
        variablesArrayErrors[memberIndex] = memberErrors;
      }

      return memberErrors;
    });

    if (variablesArrayErrors.length) {
      errors.privateVariables = variablesArrayErrors;
    }
  }

  if (values.publicVariables && values.publicVariables.length) {
    const variablesArrayErrors = [];
    values.publicVariables.forEach((member, memberIndex) => {
      const memberErrors = {};

      if (!member || !member.name) {
        memberErrors.name = 'name is required';
        variablesArrayErrors[memberIndex] = memberErrors;
      }

      if (!member || !member.value) {
        memberErrors.value = 'value is required';
        variablesArrayErrors[memberIndex] = memberErrors;
      }

      return memberErrors;
    });

    if (variablesArrayErrors.length) {
      errors.publicVariables = variablesArrayErrors;
    }
  }

  if (values.linkedProviders && values.linkedProviders.length) {
    const variablesArrayErrors = [];
    values.linkedProviders.forEach((member, memberIndex) => {
      const memberErrors = {};

      if (!member || !member.name) {
        memberErrors.name = 'prefix is required';
        variablesArrayErrors[memberIndex] = memberErrors;
      }

      if (!member || !member.id) {
        memberErrors.id = 'provider is required';
        variablesArrayErrors[memberIndex] = memberErrors;
      }

      return memberErrors;
    });

    if (variablesArrayErrors.length) {
      errors.linkedProviders = variablesArrayErrors;
    }
  }

  return errors;
};

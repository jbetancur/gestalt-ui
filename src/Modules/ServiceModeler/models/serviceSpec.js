import { cloneDeep, merge } from 'lodash';

/**
 * get
 * @param {Object} model - override the model
 */
const get = (model = {}) => {
  const safeModel = cloneDeep(model);

  return merge({
    name: '',
    description: '',
    properties: {
      provider: '7196dd82-4bbf-46f9-a17c-1393027ef8a8',
      provider_def: {
        name: '',
        extend: 'Gestalt::Configuration::Provider',
        property_defs: [],
        endpoints: [{
          kind: 'http',
          actions: [],
          authentication: {
            kind: 'Basic',
            username: '',
            password: '',
          },
          implementation: {
            id: '',
          },
        }],
      },
      supported_resources: [{
        name: '',
        properties: {
          actions: {},
          api: { },
          lineage: {
            parent_types: [],
          }
        },
        property_defs: [
          {
            name: '',
            data_type: 'string',
            visibility_type: 'plain',
            requirement_type: 'optional'
          }
        ]
      }]
    }
  }, safeModel);
};

export default {
  get,
};

import { createSelector } from 'reselect';

export const selectAPIEndpoint = state => state.metaResource.apiEndpoint.apiEndpoint;

export const getCreateEndpointModel = createSelector(
  [],
  () => {
    const model = {
      properties: {
        methods: 'GET', // converts to array
        plugins: {
          rateLimit: {
            enabled: false,
            perMinute: 60,
          },
          gestaltSecurity: {
            enabled: false,
            users: [],
            groups: [],
          },
        },
        implementation_type: 'lambda',
        resource: '',
        implementation_id: '',
        synchronous: true,
      }
    };

    return model;
  }
);

export const getEditEndpointModel = createSelector(
  [selectAPIEndpoint],
  (apiEndpoint) => {
    const model = {
      name: apiEndpoint.name,
      description: apiEndpoint.description,
      properties: {
        ...apiEndpoint.properties,
        plugins: {
          ...apiEndpoint.properties.plugins,
        }
      },
    };

    if (model.properties.methods && Array.isArray(model.properties.methods)) {
      model.properties.methods = model.properties.methods.join(',');
    }

    return model;
  }
);

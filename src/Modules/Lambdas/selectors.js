import { createSelector } from 'reselect';
import base64 from 'base-64';
import { merge } from 'lodash';
import { metaModels } from 'Modules/MetaResource';
import { mapTo2DArray } from 'util/helpers/transformations';

export const selectLambda = state => state.metaResource.lambda.lambda;
export const selectEnv = state => state.metaResource.env.env;

export const getCreateLambdaModel = createSelector(
  [selectEnv],
  (env) => {
    const model = {
      name: '',
      properties: {
        env: mapTo2DArray(env, 'name', 'value', { inherited: true }),
        headers: {
          Accept: 'text/plain'
        },
        code: '',
        code_type: 'package',
        compressed: false,
        cpus: 0.1,
        memory: 512,
        timeout: 30,
        handler: '',
        package_url: '',
        public: true,
        runtime: '',
        // Providers is really an array of {id, locations[]}
        provider: {},
        periodic_info: {
          payload: {},
        },
      },
    };

    return merge(metaModels.lambda.get(), model);
  }
);

export const getEditLambdaModel = createSelector(
  [selectLambda],
  (lambda) => {
    const model = {
      name: lambda.name,
      description: lambda.description,
      properties: {
        env: mapTo2DArray(lambda.properties.env),
        headers: lambda.properties.headers,
        code: lambda.properties.code && base64.decode(lambda.properties.code),
        code_type: lambda.properties.code_type,
        compressed: lambda.properties.compressed,
        cpus: lambda.properties.cpus,
        memory: lambda.properties.memory,
        timeout: lambda.properties.timeout,
        handler: lambda.properties.handler,
        package_url: lambda.properties.package_url,
        public: lambda.properties.public,
        runtime: lambda.properties.runtime,
        provider: lambda.properties.provider,
        // TODO: Refactor this into some model
        periodic_info: {
          payload: {
            data: lambda.properties.periodic_info && lambda.properties.periodic_info.payload && lambda.properties.periodic_info.payload.data && base64.decode(lambda.properties.periodic_info.payload.data),
            eventName: lambda.properties.periodic_info && lambda.properties.periodic_info.payload && lambda.properties.periodic_info.payload.eventName,
          },
          schedule: lambda.properties.periodic_info && lambda.properties.periodic_info.schedule,
          timezone: lambda.properties.periodic_info && lambda.properties.periodic_info.timezone,
        },
      },
    };

    return merge(metaModels.lambda.get(), model);
  }
);

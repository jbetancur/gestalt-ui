import { createSelector } from 'reselect';
import base64 from 'base-64';
import { metaModels } from 'Modules/MetaResource';
import { mapTo2DArray } from 'util/helpers/transformations';

export const selectLambda = state => state.metaResource.lambda.lambda;
export const selectLambdas = state => state.metaResource.lambdas.lambdas;
export const selectEnv = state => state.metaResource.env.env;

export const getCreateLambdaModel = createSelector(
  [selectEnv],
  (env) => {
    const model = {
      properties: {
        env: mapTo2DArray(env, 'name', 'value', { inherited: true })
      }
    };

    return metaModels.lambda.get(model);
  }
);

export const getEditLambdaModel = createSelector(
  [selectLambda],
  (lambda) => {
    const model = {
      ...lambda,
      properties: {
        ...lambda.properties,
        code: lambda.properties.code && base64.decode(lambda.properties.code),
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

    return metaModels.lambda.create(model);
  }
);

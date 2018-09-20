import { createSelector } from 'reselect';
import base64 from 'base-64';
import { mapTo2DArray } from 'util/helpers/transformations';
import lambdaModel from './models/lambda';

export const selectLambda = state => state.lambdas.lambda.lambda;
export const selectLambdas = state => state.lambdas.lambdas.lambdas;
export const selectEnv = state => state.env.env.env;

export const getCreateLambdaModel = createSelector(
  [selectEnv],
  (env) => {
    const model = {
      properties: {
        env: mapTo2DArray(env, 'name', 'value', { inherited: true }),
      }
    };

    return lambdaModel.get(model);
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

    return lambdaModel.create(model);
  }
);

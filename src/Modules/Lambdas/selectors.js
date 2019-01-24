import { createSelector } from 'reselect';
// import base64 from 'base-64';
// import { isBase64 } from 'util/helpers/strings';
// import { get } from 'lodash';
import lambdaModel from './models/lambda';

export const selectLambda = state => state.lambdas.lambda.lambda;
export const selectLambdas = state => state.lambdas.lambdas.lambdas;
export const selectEnv = state => state.lambdas.lambda.inheritedEnv;

export const getCreateLambdaModel = createSelector(
  [selectEnv],
  (env) => {
    const model = {
      properties: {
        env,
      }
    };

    return lambdaModel.get(model);
  }
);

export const getEditLambdaModel = createSelector(
  [selectLambda],
  lambda => lambdaModel.get(lambda)
);

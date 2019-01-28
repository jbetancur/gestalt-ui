import { createSelector } from 'reselect';
import lambdaModel from '../models/lambda';

export const selectLambda = state => state.lambdas.lambda.lambda;
export const selectLambdas = state => state.lambdas.lambdas.lambdas;
export const selectEnv = state => state.lambdas.lambda.inheritedEnv;

export const getCreateLambdaModel = createSelector(
  [selectLambda, selectEnv],
  (lambda, env) => {
    const model = {
      ...lambda,
      properties: {
        ...lambda.properties,
        env,
      }
    };

    return lambdaModel.initForm(model);
  }
);

export const getEditLambdaModel = createSelector(
  [selectLambda],
  lambda => lambdaModel.initForm(lambda),
);

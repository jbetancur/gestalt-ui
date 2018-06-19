import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectPolicies = state => state.metaResource.policies.policies;
export const selectPolicy = state => state.metaResource.policy.policy;

export const getEditPolicyModel = createSelector(
  [selectPolicy],
  (policy) => {
    const model = {
      name: policy.name,
      description: policy.description,
    };

    return metaModels.policy.create(model);
  }
);

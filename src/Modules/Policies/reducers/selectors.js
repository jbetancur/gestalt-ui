import { createSelector } from 'reselect';
import policyModel from '../models/policy';

export const selectPolicies = state => state.policies.policies.policies;
export const selectPolicy = state => state.policies.policy.policy;

export const getEditPolicyModel = createSelector(
  [selectPolicy],
  policy => policyModel.initForm(policy),
);

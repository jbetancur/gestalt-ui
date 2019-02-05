import { createSelector } from 'reselect';
import policyRuleModel from '../models/policyRule';

export const selectRule = state => state.policyRules.policyRule.policyRule;

export const getCreateEventRuleModel = createSelector(
  [],
  () => {
    const model = { properties: { lambda: '' } };

    return policyRuleModel.get(model);
  }
);

export const getEditEventRuleModel = createSelector(
  [selectRule],
  (rule) => {
    const model = { ...rule };

    return policyRuleModel.create(model);
  }
);

export const getCreateLimitRuleModel = createSelector(
  [],
  () => {
    const model = { properties: { strict: false, eval_logic: {}, } };

    return policyRuleModel.get(model);
  }
);

export const getEditLimitRuleModel = createSelector(
  [selectRule],
  (rule) => {
    const model = { ...rule };

    return policyRuleModel.create(model);
  }
);

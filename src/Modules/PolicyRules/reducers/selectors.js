import { createSelector } from 'reselect';
import eventRuleModel from '../models/eventRule';
import limitRuleModel from '../models/limitRule';

export const selectRule = state => state.policyRules.policyRule.policyRule;

// TODO: Remove model lambda is consistently an object
export const getCreateEventRuleModel = createSelector(
  [],
  () => {
    const model = { properties: { lambda: '' } };

    return eventRuleModel.initForm(model);
  }
);

export const getEditEventRuleModel = createSelector(
  [selectRule],
  rule => eventRuleModel.initForm(rule),
);

export const getCreateLimitRuleModel = createSelector(
  [],
  () => limitRuleModel.initForm(),
);

export const getEditLimitRuleModel = createSelector(
  [selectRule],
  rule => limitRuleModel.initForm(rule),
);

import { createSelector } from 'reselect';
import { metaModels } from 'Modules/MetaResource';

export const selectRule = state => state.metaResource.policyRule.policyRule;

export const getCreateEventRuleModel = createSelector(
  [],
  () => {
    const model = { properties: { lambda: '' } };

    return metaModels.policyRule.get(model);
  }
);

export const getEditEventRuleModel = createSelector(
  [selectRule],
  (rule) => {
    const model = { ...rule };

    return metaModels.policyRule.create(model);
  }
);

export const getCreateLimitRuleModel = createSelector(
  [],
  () => {
    const model = { properties: { strict: false, eval_logic: {}, } };

    return metaModels.policyRule.get(model);
  }
);

export const getEditLimitRuleModel = createSelector(
  [selectRule],
  (rule) => {
    const model = { ...rule };

    return metaModels.policyRule.create(model);
  }
);

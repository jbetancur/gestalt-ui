import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PolicyLimitRuleCreate from './containers/PolicyLimitRuleCreate';
import PolicyLimitRuleEdit from './containers/PolicyLimitRuleEdit';
import PolicyEventRuleCreate from './containers/PolicyEventRuleCreate';
import PolicyEventRuleEdit from './containers/PolicyEventRuleEdit';

const APIRoot = () => (
  <div>
    <Switch>
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules/createlimitRule'} component={PolicyLimitRuleCreate} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules/:ruleId/editlimitRule'} component={PolicyLimitRuleEdit} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules/createeventRule'} component={PolicyEventRuleCreate} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules/:ruleId/editeventRule'} component={PolicyEventRuleEdit} />
    </Switch>
  </div>
);

export default APIRoot;
export { default as PolicyRules } from './containers/PolicyRuleListing';
export { default as PolicyLimitRuleCreate } from './containers/PolicyLimitRuleCreate';
export { default as PolicyLimitRuleEdit } from './containers/PolicyLimitRuleEdit';
export { default as PolicyEventRuleCreate } from './containers/PolicyEventRuleCreate';
export { default as PolicyEventRuleEdit } from './containers/PolicyEventRuleEdit';
export { default as payloadTransformer } from './payloadTransformer';

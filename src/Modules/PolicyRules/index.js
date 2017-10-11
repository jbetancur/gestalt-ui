import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PolicyLimitRuleCreate from './containers/PolicyLimitRuleCreateContainer';
import PolicyLimitRuleEdit from './containers/PolicyLimitRuleEditContainer';
import PolicyEventRuleCreate from './containers/PolicyEventRuleCreateContainer';
import PolicyEventRuleEdit from './containers/PolicyEventRuleEditContainer';

const APIRoot = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules/createlimitRule" component={PolicyLimitRuleCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules/:ruleId/editlimitRule" component={PolicyLimitRuleEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules/createeventRule" component={PolicyEventRuleCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules/:ruleId/editeventRule" component={PolicyEventRuleEdit} />
  </Switch>
);

export default APIRoot;
export { default as PolicyRules } from './containers/PolicyRuleListingContainer';
export { default as PolicyLimitRuleCreate } from './containers/PolicyLimitRuleCreateContainer';
export { default as PolicyLimitRuleEdit } from './containers/PolicyLimitRuleEditContainer';
export { default as PolicyEventRuleCreate } from './containers/PolicyEventRuleCreateContainer';
export { default as PolicyEventRuleEdit } from './containers/PolicyEventRuleEditContainer';
export { default as payloadTransformer } from './payloadTransformer';

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PolicyRuleRoot from 'Modules/PolicyRules';
import PolicyListing from './containers/PolicyListingContainer';
import PolicyCreate from './containers/PolicyCreateContainer';
import PolicyEdit from './containers/PolicyEditContainer';

const PolicyRoot = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies" component={PolicyListing} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/create" component={PolicyCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit" component={PolicyEdit} />
    <Route path="/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules" component={PolicyRuleRoot} />
  </Switch>
);

export default PolicyRoot;
export { default as Policies } from './containers/PolicyListingContainer';
export { default as PolicyCreate } from './containers/PolicyCreateContainer';
export { default as PolicyEdit } from './containers/PolicyEditContainer';
export { default as payloadTransformer } from './payloadTransformer';

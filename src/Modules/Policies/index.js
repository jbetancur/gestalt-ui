import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PolicyRuleRoot from 'Modules/PolicyRules';
import PolicyListing from './containers/PolicyListing';
import PolicyCreate from './containers/PolicyCreate';
import PolicyEdit from './containers/PolicyEdit';

const PolicyRoot = () => (
  <div>
    <Switch>
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies'} component={PolicyListing} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/create'} component={PolicyCreate} />
      <Route exact path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit'} component={PolicyEdit} />
      <Route path={'/:fqon/hierarchy/:workspaceId/environments/:environmentId/policies/:policyId/edit/rules'} component={PolicyRuleRoot} />
    </Switch>
  </div>
);

export default PolicyRoot;
export { default as Policies } from './containers/PolicyListing';
export { default as PolicyCreate } from './containers/PolicyCreate';
export { default as PolicyEdit } from './containers/PolicyEdit';
export { default as payloadTransformer } from './payloadTransformer';

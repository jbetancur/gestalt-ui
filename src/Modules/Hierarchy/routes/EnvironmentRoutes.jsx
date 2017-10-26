import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import { Providers, ProviderCreate, ProviderEdit } from 'Modules/Providers';
import { Lambdas, LambdaCreate, LambdaEdit } from 'Modules/Lambdas';
import { Containers, ContainerCreate, ContainerEdit } from 'Modules/Containers';
import { Policies, PolicyCreate, PolicyEdit } from 'Modules/Policies';
import { Secrets, SecretCreate, SecretEdit } from 'Modules/Secrets';
import { APIs, APICreate, APIEdit } from 'Modules/APIs';
import { APIEndpoints, APIEndpointCreate, APIEndpointEdit } from 'Modules/APIEndpoints';
import { PolicyRules, PolicyLimitRuleCreate, PolicyLimitRuleEdit, PolicyEventRuleCreate, PolicyEventRuleEdit } from 'Modules/PolicyRules';
import EnvironmentEdit from '../containers/EnvironmentEditContainer';

const EnvironmentRoutes = () => (
  <Switch>
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/edit" component={EnvironmentEdit} />

    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/providers" component={Providers} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/providers/create" component={ProviderCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/providers/:providerId/edit" component={ProviderEdit} />

    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/lambdas" component={Lambdas} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/lambdas/create" component={LambdaCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/lambdas/:lambdaId/edit" component={LambdaEdit} />

    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/containers" component={Containers} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/containers/create" component={ContainerCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/containers/:containerId/edit" component={ContainerEdit} />

    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/apis" component={APIs} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/apis/create" component={APICreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/apis/:apiId/edit" component={APIEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/apis/:apiId/edit/apiendpoints" component={APIEndpoints} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/apis/:apiId/edit/apiendpoints/createEndpoint" component={APIEndpointCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/apis/:apiId/edit/apiendpoints/:apiEndpointId/editEndpoint" component={APIEndpointEdit} />

    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/policies" component={Policies} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/policies/create" component={PolicyCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/policies/:policyId/edit" component={PolicyEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/policies/:policyId/edit/rules" component={PolicyRules} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/policies/:policyId/edit/rules/createlimitRule" component={PolicyLimitRuleCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/policies/:policyId/edit/rules/:ruleId/editlimitRule" component={PolicyLimitRuleEdit} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/policies/:policyId/edit/rules/createeventRule" component={PolicyEventRuleCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/policies/:policyId/edit/rules/:ruleId/editeventRule" component={PolicyEventRuleEdit} />

    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/secrets" component={Secrets} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/secrets/create" component={SecretCreate} />
    <Route exact path="/:fqon/hierarchy/:workspaceId/environment/:environmentId/secrets/:secretId/edit" component={SecretEdit} />

    <Route component={NotFound} />
  </Switch>
);

export default EnvironmentRoutes;

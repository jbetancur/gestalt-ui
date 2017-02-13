import React from 'react';
import { Route, IndexRoute } from 'react-router';
import cookie from 'react-cookie';

import App from './App';
import Login from './modules/Login';
import Organizations from './modules/Organizations';
import OrgCreate from './modules/Organizations/containers/OrgCreate';
import OrgEdit from './modules/Organizations/containers/OrgEdit';
import WorkspaceCreate from './modules/Workspaces/containers/WorkspaceCreate';
import WorkspaceEdit from './modules/Workspaces/containers/WorkspaceEdit';
import Workspaces from './modules/Workspaces';
import WorkspaceDetails from './modules/Workspaces/containers/WorkspaceDetails';
import Environments from './modules/Environments';
import EnvironmentEdit from './modules/Environments/containers/EnvironmentEdit';
import EnvironmentDetails from './modules/Environments/containers/EnvironmentDetails';
import EnvironmentCreate from './modules/Environments/containers/EnvironmentCreate';
import Providers from './modules/Providers';
import ProviderCreate from './modules/Providers/containers/ProviderCreate';
import ProviderEdit from './modules/Providers/containers/ProviderEdit';
import Lambdas from './modules/Lambdas';
import LambdaCreate from './modules/Lambdas/containers/LambdaCreate';
import LambdaEdit from './modules/Lambdas/containers/LambdaEdit';
import Entitlements from './modules/Entitlements';
import Users from './modules/Users';
import UserCreate from './modules/Users/containers/UserCreate';
import UserEdit from './modules/Users/containers/UserEdit';
import Groups from './modules/Groups';
import GroupCreate from './modules/Groups/containers/GroupCreate';
import GroupEdit from './modules/Groups/containers/GroupEdit';
import Policies from './modules/Policies';
import PolicyCreate from './modules/Policies/containers/PolicyCreate';
import PolicyEdit from './modules/Policies/containers/PolicyEdit';
import PolicyLimitRuleCreate from './modules/PolicyRules/containers/PolicyLimitRuleCreate';
import PolicyLimitRuleEdit from './modules/PolicyRules/containers/PolicyLimitRuleEdit';
import PolicyEventRuleCreate from './modules/PolicyRules/containers/PolicyEventRuleCreate';
import PolicyEventRuleEdit from './modules/PolicyRules/containers/PolicyEventRuleEdit';
import License from './modules/Licensing';
import NotFound from './components/NotFound';

function requireAuth(nextState, replace) {
  const validCookie = !!cookie.load('auth-token') || false;
  if (!validCookie) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

const routes = (
  <div>
    <Route path="login" component={Login} />
    <Route path="/" component={App} onEnter={requireAuth}>
      <Route path=":fqon/organizations" onEnter={requireAuth}>
        <IndexRoute component={Organizations} onEnter={requireAuth} />
        <Route path="create" component={OrgCreate} onEnter={requireAuth} />
        <Route path="edit" component={OrgEdit} onEnter={requireAuth} />
      </Route>
      <Route path=":fqon/workspaces" onEnter={requireAuth}>
        <IndexRoute component={Workspaces} onEnter={requireAuth} />
        <Route path="create" component={WorkspaceCreate} onEnter={requireAuth} />
        <Route path=":workspaceId" onEnter={requireAuth}>
          <IndexRoute component={WorkspaceDetails} onEnter={requireAuth} />
          <Route path="edit" component={WorkspaceEdit} onEnter={requireAuth} />
          <Route path="createEnvironment" component={EnvironmentCreate} onEnter={requireAuth} />
          <Route path="providers" onEnter={requireAuth}>
            <IndexRoute component={Providers} onEnter={requireAuth} />
            <Route path="create" component={ProviderCreate} onEnter={requireAuth} />
            <Route path=":providerId" onEnter={requireAuth}>
              <Route path="edit" component={ProviderEdit} onEnter={requireAuth} />
            </Route>
          </Route>
          <Route path="environments" onEnter={requireAuth}>
            <Route path="createProvider" component={ProviderCreate} onEnter={requireAuth} />
            <IndexRoute component={Environments} onEnter={requireAuth} />
            <Route path=":environmentId" onEnter={requireAuth}>
              <IndexRoute component={EnvironmentDetails} onEnter={requireAuth} />
              <Route path="edit" component={EnvironmentEdit} onEnter={requireAuth} />
              <Route path="lambdas" onEnter={requireAuth}>
                <IndexRoute component={Lambdas} onEnter={requireAuth} />
                <Route path="create" component={LambdaCreate} onEnter={requireAuth} />
                <Route path=":lambdaId" onEnter={requireAuth}>
                  <Route path="edit" component={LambdaEdit} onEnter={requireAuth} />
                </Route>
              </Route>
              <Route path="policies" onEnter={requireAuth}>
                <IndexRoute component={Policies} onEnter={requireAuth} />
                <Route path="create" component={PolicyCreate} onEnter={requireAuth} />
                <Route path=":policyId" onEnter={requireAuth}>
                  <Route path="edit" onEnter={requireAuth}>
                    <IndexRoute component={PolicyEdit} onEnter={requireAuth} />
                    <Route path="rules/createlimitRule" component={PolicyLimitRuleCreate} onEnter={requireAuth} />
                    <Route path="rules/:ruleId/editlimitRule" component={PolicyLimitRuleEdit} onEnter={requireAuth} />
                    <Route path="rules/createeventRule" component={PolicyEventRuleCreate} onEnter={requireAuth} />
                    <Route path="rules/:ruleId/editeventRule" component={PolicyEventRuleEdit} onEnter={requireAuth} />
                  </Route>
                </Route>
              </Route>
              <Route path="providers" onEnter={requireAuth}>
                <IndexRoute component={Providers} onEnter={requireAuth} />
                <Route path="create" component={ProviderCreate} onEnter={requireAuth} />
                <Route path=":providerId" onEnter={requireAuth}>
                  <Route path="edit" component={ProviderEdit} onEnter={requireAuth} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path=":fqon/providers" onEnter={requireAuth}>
        <IndexRoute component={Providers} onEnter={requireAuth} />
        <Route path="create" component={ProviderCreate} onEnter={requireAuth} />
        <Route path=":providerId" onEnter={requireAuth}>
          <Route path="edit" component={ProviderEdit} onEnter={requireAuth} />
        </Route>
      </Route>
      <Route path=":fqon/entitlements" component={Entitlements} onEnter={requireAuth} />
      <Route path=":fqon/users" onEnter={requireAuth}>
        <IndexRoute component={Users} onEnter={requireAuth} />
        <Route path="create" component={UserCreate} onEnter={requireAuth} />
        <Route path=":userId" onEnter={requireAuth}>
          <Route path="edit" component={UserEdit} onEnter={requireAuth} />
        </Route>
      </Route>
      <Route path=":fqon/groups" onEnter={requireAuth}>
        <IndexRoute component={Groups} onEnter={requireAuth} />
        <Route path="create" component={GroupCreate} onEnter={requireAuth} />
        <Route path=":groupId" onEnter={requireAuth}>
          <Route path="edit" component={GroupEdit} onEnter={requireAuth} />
        </Route>
      </Route>
      <Route path=":fqon/license" component={License} onEnter={requireAuth} />
      <Route path="*" component={NotFound} />
    </Route>
  </div>
);

export default routes;

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
import Containers from './modules/Containers';
import ContainerCreate from './modules/Containers/containers/ContainerCreate';
import ContainerEdit from './modules/Containers/containers/ContainerEdit';
import License from './modules/Licensing';
import NotFound from './components/NotFound';

const requireAuth = () => (nextState, replace) => {
  const validCookie = !!cookie.load('auth-token') || false;
  if (!validCookie) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};

const routes = store => (
  <div>
    <Route path="login" component={Login} />
    <Route path="/" component={App} onEnter={requireAuth(store)}>
      <Route path=":fqon/organizations" onEnter={requireAuth(store)}>
        <IndexRoute component={Organizations} onEnter={requireAuth(store)} />
        <Route path="create" component={OrgCreate} onEnter={requireAuth(store)} />
        <Route path="edit" component={OrgEdit} onEnter={requireAuth(store)} />
      </Route>
      <Route path=":fqon/workspaces" onEnter={requireAuth(store)}>
        <IndexRoute component={Workspaces} onEnter={requireAuth(store)} />
        <Route path="create" component={WorkspaceCreate} onEnter={requireAuth(store)} />
        <Route path=":workspaceId" onEnter={requireAuth(store)}>
          <IndexRoute component={WorkspaceDetails} onEnter={requireAuth(store)} />
          <Route path="edit" component={WorkspaceEdit} onEnter={requireAuth(store)} />
          <Route path="createEnvironment" component={EnvironmentCreate} onEnter={requireAuth(store)} />
          <Route path="providers" onEnter={requireAuth(store)}>
            <IndexRoute component={Providers} onEnter={requireAuth(store)} />
            <Route path="create" component={ProviderCreate} onEnter={requireAuth(store)} />
            <Route path=":providerId" onEnter={requireAuth(store)}>
              <Route path="edit" component={ProviderEdit} onEnter={requireAuth(store)} />
            </Route>
          </Route>
          <Route path="environments" onEnter={requireAuth(store)}>
            <Route path="createProvider" component={ProviderCreate} onEnter={requireAuth(store)} />
            <IndexRoute component={Environments} onEnter={requireAuth(store)} />
            <Route path=":environmentId" onEnter={requireAuth(store)}>
              <IndexRoute component={EnvironmentDetails} onEnter={requireAuth(store)} />
              <Route path="edit" component={EnvironmentEdit} onEnter={requireAuth(store)} />
              <Route path="lambdas" onEnter={requireAuth(store)}>
                <IndexRoute component={Lambdas} onEnter={requireAuth(store)} />
                <Route path="create" component={LambdaCreate} onEnter={requireAuth(store)} />
                <Route path=":lambdaId" onEnter={requireAuth(store)}>
                  <Route path="edit" component={LambdaEdit} onEnter={requireAuth(store)} />
                </Route>
              </Route>
              <Route path="containers" onEnter={requireAuth(store)}>
                <IndexRoute component={Containers} onEnter={requireAuth(store)} />
                <Route path="create" component={ContainerCreate} onEnter={requireAuth(store)} />
                <Route path=":containerId" onEnter={requireAuth(store)}>
                  <Route path="edit" component={ContainerEdit} onEnter={requireAuth(store)} />
                </Route>
              </Route>
              <Route path="policies" onEnter={requireAuth(store)}>
                <IndexRoute component={Policies} onEnter={requireAuth(store)} />
                <Route path="create" component={PolicyCreate} onEnter={requireAuth(store)} />
                <Route path=":policyId" onEnter={requireAuth(store)}>
                  <Route path="edit" onEnter={requireAuth(store)}>
                    <IndexRoute component={PolicyEdit} onEnter={requireAuth(store)} />
                    <Route path="rules/createlimitRule" component={PolicyLimitRuleCreate} onEnter={requireAuth(store)} />
                    <Route path="rules/:ruleId/editlimitRule" component={PolicyLimitRuleEdit} onEnter={requireAuth(store)} />
                    <Route path="rules/createeventRule" component={PolicyEventRuleCreate} onEnter={requireAuth(store)} />
                    <Route path="rules/:ruleId/editeventRule" component={PolicyEventRuleEdit} onEnter={requireAuth(store)} />
                  </Route>
                </Route>
              </Route>
              <Route path="providers" onEnter={requireAuth(store)}>
                <IndexRoute component={Providers} onEnter={requireAuth(store)} />
                <Route path="create" component={ProviderCreate} onEnter={requireAuth(store)} />
                <Route path=":providerId" onEnter={requireAuth(store)}>
                  <Route path="edit" component={ProviderEdit} onEnter={requireAuth(store)} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path=":fqon/providers" onEnter={requireAuth(store)}>
        <IndexRoute component={Providers} onEnter={requireAuth(store)} />
        <Route path="create" component={ProviderCreate} onEnter={requireAuth(store)} />
        <Route path=":providerId" onEnter={requireAuth(store)}>
          <Route path="edit" component={ProviderEdit} onEnter={requireAuth(store)} />
        </Route>
      </Route>
      <Route path=":fqon/entitlements" component={Entitlements} onEnter={requireAuth(store)} />
      <Route path=":fqon/users" onEnter={requireAuth(store)}>
        <IndexRoute component={Users} onEnter={requireAuth(store)} />
        <Route path="create" component={UserCreate} onEnter={requireAuth(store)} />
        <Route path=":userId" onEnter={requireAuth(store)}>
          <Route path="edit" component={UserEdit} onEnter={requireAuth(store)} />
        </Route>
      </Route>
      <Route path=":fqon/groups" onEnter={requireAuth(store)}>
        <IndexRoute component={Groups} onEnter={requireAuth(store)} />
        <Route path="create" component={GroupCreate} onEnter={requireAuth(store)} />
        <Route path=":groupId" onEnter={requireAuth(store)}>
          <Route path="edit" component={GroupEdit} onEnter={requireAuth(store)} />
        </Route>
      </Route>
      <Route path=":fqon/license" component={License} onEnter={requireAuth(store)} />
      <Route path="*" component={NotFound} />
    </Route>
  </div>
);

export default routes;

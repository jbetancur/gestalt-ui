import React from 'react';
import { Route, IndexRoute } from 'react-router';
import cookie from 'react-cookie';
import App from './App';
import { Login } from './modules/Login';
import Hierarchy, {
  OrganizationCreate,
  OrganizationEdit,
  WorkspaceCreate,
  WorkspaceEdit,
  WorkspaceContext,
  EnvironmentListing,
  EnvironmentCreate,
  EnvironmentEdit,
  EnvironmentContext
} from './modules/Hierarchy';
import Providers from './modules/Providers';
import ProviderCreate from './modules/Providers/containers/ProviderCreate';
import ProviderEdit from './modules/Providers/containers/ProviderEdit';
// import Lambdas from './modules/Lambdas';
import LambdaCreate from './modules/Lambdas/containers/LambdaCreate';
import LambdaEdit from './modules/Lambdas/containers/LambdaEdit';
import Users from './modules/Users';
import UserCreate from './modules/Users/containers/UserCreate';
import UserEdit from './modules/Users/containers/UserEdit';
import Groups from './modules/Groups';
import GroupCreate from './modules/Groups/containers/GroupCreate';
import GroupEdit from './modules/Groups/containers/GroupEdit';
// import Policies from './modules/Policies';
import PolicyCreate from './modules/Policies/containers/PolicyCreate';
import PolicyEdit from './modules/Policies/containers/PolicyEdit';
import PolicyLimitRuleCreate from './modules/PolicyRules/containers/PolicyLimitRuleCreate';
import PolicyLimitRuleEdit from './modules/PolicyRules/containers/PolicyLimitRuleEdit';
import PolicyEventRuleCreate from './modules/PolicyRules/containers/PolicyEventRuleCreate';
import PolicyEventRuleEdit from './modules/PolicyRules/containers/PolicyEventRuleEdit';
import { ContainerCreate, ContainerEdit } from './modules/Containers';
// import APIs from './modules/APIs';
import APICreate from './modules/APIs/containers/APICreate';
import APIEdit from './modules/APIs/containers/APIEdit';
import APIEndpointCreate from './modules/APIEndpoints/containers/APIEndpointCreate';
import APIEndpointEdit from './modules/APIEndpoints/containers/APIEndpointEdit';
import { License } from './modules/Licensing';
import Logging from './modules/Logging';
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
    <Route path="/undefined/*" component={App} onEnter={requireAuth(store)} />
    <Route path="/[object%20Object]/*" component={App} onEnter={requireAuth(store)} />
    <Route path="/logs" component={Logging} onEnter={requireAuth(store)} />
    <Route path="/" component={App} onEnter={requireAuth(store)}>

      <Route path=":fqon/hierarchy" onEnter={requireAuth(store)}>
        <IndexRoute component={Hierarchy} onEnter={requireAuth(store)} />

        <Route path="createOrganization" component={OrganizationCreate} onEnter={requireAuth(store)} />
        <Route path="editOrganization" component={OrganizationEdit} onEnter={requireAuth(store)} />

        <Route path="createWorkspace" component={WorkspaceCreate} onEnter={requireAuth(store)} />
        <Route path=":workspaceId" onEnter={requireAuth(store)}>
          <IndexRoute component={WorkspaceContext} onEnter={requireAuth(store)} />
          <Route path="editWorkspace" component={WorkspaceEdit} onEnter={requireAuth(store)} />
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
            <IndexRoute component={EnvironmentListing} onEnter={requireAuth(store)} />
            <Route path=":environmentId" onEnter={requireAuth(store)}>
              <IndexRoute component={EnvironmentContext} onEnter={requireAuth(store)} />
              <Route path="edit" component={EnvironmentEdit} onEnter={requireAuth(store)} />
              <Route path="lambdas" onEnter={requireAuth(store)}>
                <IndexRoute component={EnvironmentContext} onEnter={requireAuth(store)} />
                <Route path="create" component={LambdaCreate} onEnter={requireAuth(store)} />
                <Route path=":lambdaId" onEnter={requireAuth(store)}>
                  <Route path="edit" component={LambdaEdit} onEnter={requireAuth(store)} />
                </Route>
              </Route>
              <Route path="containers" onEnter={requireAuth(store)}>
                <IndexRoute component={EnvironmentContext} onEnter={requireAuth(store)} />
                <Route path="create" component={ContainerCreate} onEnter={requireAuth(store)} />
                <Route path=":containerId" onEnter={requireAuth(store)}>
                  <Route path="edit" component={ContainerEdit} onEnter={requireAuth(store)} />
                </Route>
              </Route>
              <Route path="policies" onEnter={requireAuth(store)}>
                <IndexRoute component={EnvironmentContext} onEnter={requireAuth(store)} />
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
                <IndexRoute component={EnvironmentContext} onEnter={requireAuth(store)} />
                <Route path="create" component={ProviderCreate} onEnter={requireAuth(store)} />
                <Route path=":providerId" onEnter={requireAuth(store)}>
                  <Route path="edit" component={ProviderEdit} onEnter={requireAuth(store)} />
                </Route>
              </Route>
              <Route path="apis" onEnter={requireAuth(store)}>
                <IndexRoute component={EnvironmentContext} onEnter={requireAuth(store)} />
                <Route path="create" component={APICreate} onEnter={requireAuth(store)} />
                <Route path=":apiId" onEnter={requireAuth(store)}>
                  <Route path="edit" onEnter={requireAuth(store)}>
                    <IndexRoute component={APIEdit} onEnter={requireAuth(store)} />
                    <Route path="apiendpoints/createEndpoint" component={APIEndpointCreate} onEnter={requireAuth(store)} />
                    <Route path="apiendpoints/:apiEndpointId/editEndpoint" component={APIEndpointEdit} onEnter={requireAuth(store)} />
                  </Route>
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
      <Route path=":fqon/*" component={NotFound} />
      <Route path="*" component={NotFound} />
    </Route>
  </div>
);

export default routes;

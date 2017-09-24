import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import actions from '../actions';

/**
 * Higher-order component (HOC)
 */
export default function WithMetaResource(WrapperMetaResourceComponent) {
  class Resource extends PureComponent {
    render() {
      return <WrapperMetaResourceComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    const { metaResource } = state;

    return {
      currentOrgContext: metaResource.currentOrgContext.organization,
      currentWorkspaceContext: metaResource.currentWorkspaceContext.workspace,
      currentEnvironmentContext: metaResource.currentEnvironmentContext.environment,
      self: metaResource.self.self,
      selfPending: metaResource.self.pending,

      // Subscriptions for an organization and its workspaces and sub orgs
      organizationSet: metaResource.organizationSet.organization,
      orangizationSetPending: metaResource.organizationSet.pending,
      organizationsSet: metaResource.organizationSet.organization.subOrganizations,
      workspacesSet: metaResource.organizationSet.organization.workspaces,

      // Subscriptions for organizations
      organization: metaResource.organization.organization,
      organizationPending: metaResource.organization.pending,
      organizations: metaResource.organizations.organizations,
      organizationsPending: metaResource.organizations.pending,
      allOrganizations: metaResource.allOrganizations.organizations,
      allOrganizationsPending: metaResource.allOrganizations.pending,

      // Subscriptions for environments
      environment: metaResource.environment.environment,
      environmentPending: metaResource.environment.pending,
      environments: metaResource.environments.environments,
      environmentsPending: metaResource.environments.pending,

      // Subscriptions for Workspaces
      workspace: metaResource.workspace.workspace,
      workspacePending: metaResource.workspace.pending,
      workspaces: metaResource.workspaces.workspaces,
      workspacesPending: metaResource.workspaces.pending,

      // Subscriptions for Entitlements
      identities: metaResource.entitlementIdentities.identities,
      identitiesPending: metaResource.entitlementIdentities.pending,
      entitlements: metaResource.entitlements.entitlements,
      entitlementsPending: metaResource.entitlements.pending,
      entitlementsUpdatePending: metaResource.entitlementUpdate.pending,

      // integrations: state.integrations.fetchAll.integrations,
      // integrationsPending: state.integrations.fetchAll.pending,

      // Subscriptions for Env
      env: metaResource.env.env,
      envPending: metaResource.env.pending,

      // Subscriptions for Containers
      containers: metaResource.containers.containers,
      containersPending: metaResource.containers.pending,
      container: metaResource.container.container,
      containerPending: metaResource.container.pending,
      containerUpdatePending: state.metaResource.containerUpdate.pending,

      // Subscriptions for Providers
      providers: metaResource.providers.providers,
      providersPending: metaResource.providers.pending,
      provider: metaResource.provider.provider,
      providerPending: metaResource.provider.pending,
      providerUpdated: metaResource.providerUpdate.provider,
      providerUpdatePending: metaResource.providerUpdate.pending,
      providersByType: metaResource.providersByType.providers,
      providersByTypePending: metaResource.providersByType.pending,
      providersKongByGateway: metaResource.fetchProviderKongsByGateway.providers,
      providersKongByGatewayPending: metaResource.fetchProviderKongsByGateway.pending,

      // Subscriptions for Lambdas
      lambdas: metaResource.lambdas.lambdas,
      lambdasPending: metaResource.lambdas.pending,
      lambda: metaResource.lambda.lambda,
      lambdaPending: metaResource.lambda.pending,
      lambdaProvider: metaResource.lambdaProvider.provider,

      // Subscriptions for apis
      api: metaResource.api.api,
      apis: metaResource.apis.apis,
      apisPending: metaResource.apis.pending,
      apiPending: metaResource.api.pending,

      // Subscriptions for apiEndpoints
      apiEndpoint: metaResource.apiEndpoint.apiEndpoint,
      apiEndpointPending: metaResource.apiEndpoint.pending,
      apiEndpointsPending: metaResource.apiEndpoints.pending,
      apiEndpointUpdatePending: metaResource.apiEndpointUpdate.pending,
      apiEndpointUpdated: metaResource.apiEndpointUpdate.apiEndpoint,

      // Subscriptions for Groups
      groups: metaResource.groups.groups,
      groupsPending: metaResource.groups.pending,
      group: metaResource.group.group,
      groupPending: metaResource.group.pending,
      groupUpdatePending: metaResource.groupUpdate.pending,
      groupUpdated: metaResource.groupMembers.group,
      groupMembersPending: metaResource.groupMembers.pending,

      // Subscriptions for Users
      users: metaResource.users.users,
      usersPending: metaResource.users.pending,
      user: metaResource.user.user,
      userPending: metaResource.user.pending,
      userUpdatePending: metaResource.userUpdate.pending,

      // Subscriptions for Policy
      policies: metaResource.policies.policies,
      policiesPending: metaResource.policies.pending,
      policy: metaResource.policy.policy,
      policyPending: metaResource.policy.pending,

      // Subscriptions for Policy Rules
      policyRules: metaResource.policyRules.policyRules,
      policyRulesPending: metaResource.policyRules.pending,
      policyRule: metaResource.policyRule.policyRule,
      policyRulePending: metaResource.policyRule.pending,

      // Subscriptions for Schema
      envSchema: metaResource.envSchema.schema,
      envSchemaPending: metaResource.envSchema.pending,

      // Subscriptions for DropDowns
      allOrganizationsDropDown: metaResource.allOrganizationsDropDown.organizations,
      executorsDropDown: metaResource.executors.executors,
      lambdasDropDown: metaResource.lambdasDropDown.lambdas,
      containersDropDown: metaResource.containersDropDown.containers,
      secretsDropDown: metaResource.secretsDropDown.secrets,

      // Subscriptions for Logging
      logProviderPending: metaResource.logProvider.pending,
      logProviderURL: metaResource.logProvider.logProvider.url,

      // Subscriptions for Logging
      actions: metaResource.actions.actions,
      actionsPending: metaResource.actions.pending,
      contextActions: metaResource.contextActions.contextActions,
      contextActionsPending: metaResource.contextActions.pending,

      // Subscriptions for Secrets
      secrets: metaResource.secrets.secrets,
      secretsPending: metaResource.secrets.pending,
      secret: metaResource.secret.secret,
      secretPending: metaResource.secret.pending,

      // Subscriptions for Search
      searchResults: metaResource.search.search,
      searchResultsPending: metaResource.search.pending,

      // Subscriptions for resourceTypes
      resourceTypes: metaResource.resourceTypes.resourceTypes,
      resourceTypesPending: metaResource.resourceTypes.pending,
      resourceType: metaResource.resourceType.resourceType,
      resourceTypePending: metaResource.resourceType.pending,
    };
  }

  return connect(mapStateToProps, Object.assign({}, actions))((Resource));
}


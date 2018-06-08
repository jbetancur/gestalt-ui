import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../actions';

/**
 * Higher-order component (HOC)
 */
export default function WithMetaResource(WrapperMetaResourceComponent) {
  class Resource extends Component {
    render() {
      return <WrapperMetaResourceComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    const { metaResource } = state;

    return {
      // Subscriptions for an organization and its workspaces and sub orgs
      organizationSet: metaResource.organizationSet.organization,
      organizationSetPending: metaResource.organizationSet.pending,
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

      // Subscriptions for Env
      env: metaResource.env.env,
      envPending: metaResource.env.pending,

      // Subscriptions for Providers
      providers: metaResource.providers.providers,
      providersPending: metaResource.providers.pending,
      provider: metaResource.provider.provider,
      providerPending: metaResource.provider.pending,

      // Subscriptions for Groups
      groups: metaResource.groups.groups,
      groupsPending: metaResource.groups.pending,
      group: metaResource.group.group,
      groupPending: metaResource.group.pending,
      groupUpdated: metaResource.groupMembers.group,
      groupMembersPending: metaResource.groupMembers.pending,

      // Subscriptions for Users
      users: metaResource.users.users,
      usersPending: metaResource.users.pending,
      user: metaResource.user.user,
      userPending: metaResource.user.pending,

      // Subscriptions for Schema
      envSchema: metaResource.envSchema.schema,
      envSchemaPending: metaResource.envSchema.pending,

      // Subscriptions for DropDowns
      allOrganizationsDropDown: metaResource.allOrganizationsDropDown.organizations,

      // Subscriptions for Logging
      logProviderPending: metaResource.logProvider.pending,
      logProviderURL: metaResource.logProvider.logProvider.url,

      // Subscriptions for Secrets
      secrets: metaResource.secrets.secrets,
      secretsPending: metaResource.secrets.pending,
      secret: metaResource.secret.secret,
      secretPending: metaResource.secret.pending,

      // Subscriptions for Search
      searchResults: metaResource.search.search,
      searchResultsPending: metaResource.search.pending,
    };
  }

  return connect(mapStateToProps, actions)((Resource));
}


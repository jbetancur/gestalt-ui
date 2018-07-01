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

      // Subscriptions for Search
      searchResults: metaResource.search.search,
      searchResultsPending: metaResource.search.pending,
    };
  }

  return connect(mapStateToProps, actions)((Resource));
}


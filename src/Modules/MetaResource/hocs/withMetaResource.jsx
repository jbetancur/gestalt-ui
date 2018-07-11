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

      // Subscriptions for Schema
      envSchema: metaResource.envSchema.schema,
      envSchemaPending: metaResource.envSchema.pending,

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


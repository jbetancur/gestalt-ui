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
      // Subscriptions for Logging
      logProviderPending: metaResource.logProvider.pending,
      logProviderURL: metaResource.logProvider.logProvider.url,
    };
  }

  return connect(mapStateToProps, actions)((Resource));
}

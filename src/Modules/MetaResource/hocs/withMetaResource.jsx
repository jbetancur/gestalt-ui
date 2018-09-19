import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    const { logging } = state;

    return {
      // Subscriptions for Logging
      logProviderPending: logging.logProvider.pending,
      logProviderURL: logging.logProvider.logProvider.url,
    };
  }

  return connect(mapStateToProps)((Resource));
}

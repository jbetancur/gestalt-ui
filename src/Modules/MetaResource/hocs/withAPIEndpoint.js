import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default () => (BaseComponent) => {
  class APIEndpoint extends Component {
    static displayName = 'APIEndpoint (HOC)';

    static propTypes = {
      apiEndpointActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { apiEndpointActions } = this.props;

      apiEndpointActions.unloadAPIEndpoint();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    apiEndpoint: state.metaResource.apiEndpoint.apiEndpoint,
    apiEndpointPending: state.metaResource.apiEndpoint.pending,
  });

  const mapDispatchToProps = dispatch => ({
    apiEndpointActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'APIEndpoint'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(APIEndpoint);
};

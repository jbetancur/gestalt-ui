import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class APIEndpoints extends Component {
    static displayName = 'APIEndpoints (HOC)';
    static propTypes = {
      apiEndpointsActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { apiEndpointsActions } = this.props;

        apiEndpointsActions.unloadAPIEndpoints();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    apiEndpoints: state.metaResource.apiEndpoints.apiEndpoints,
    apiEndpointsPending: state.metaResource.apiEndpoints.pending,
  });

  const mapDispatchToProps = dispatch => ({
    apiEndpointsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'APIEndpoints'),
      createRequestAction(['delete'], 'APIEndpoint'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(APIEndpoints);
};

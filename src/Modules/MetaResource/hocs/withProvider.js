import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class Provider extends Component {
    static displayName = 'Provider (HOC)';

    static propTypes = {
      providerActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { providerActions } = this.props;

        providerActions.unloadProvider();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    provider: state.metaResource.provider.provider,
    providerPending: state.metaResource.provider.pending,
  });

  const mapDispatchToProps = dispatch => ({
    providerActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete', 'redeploy'], 'Provider'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Provider);
};

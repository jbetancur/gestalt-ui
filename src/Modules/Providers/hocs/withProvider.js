import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

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
    provider: state.providers.provider.provider,
    providerPending: state.providers.provider.pending,
    providers: state.providers.provider.providers,
    resourceTypes: state.providers.provider.resourceTypes,
    selectedProviderType: state.providers.provider.selectedProviderType,
    container: state.providers.provider.container,
    envSchema: state.providers.provider.envSchema,
    envSchemaPending: state.providers.provider.envSchemaPending,
  });

  const mapDispatchToProps = dispatch => ({
    providerActions: bindActionCreators({
      ...createRequestAction(['fetch', 'create', 'update', 'delete', 'redeploy'], 'Provider'),
      ...createRequestAction(['init'], 'ProviderCreate'),
      ...createRequestAction(['init'], 'ProviderEdit'),
    }, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Provider);
};

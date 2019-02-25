import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class Providers extends Component {
    static displayName = 'Providers (HOC)';

    static propTypes = {
      providersActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { providersActions } = this.props;

        providersActions.unloadProviders();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    providers: state.providers.providers.providers,
    providersPending: state.providers.providers.pending,
  });

  const mapDispatchToProps = dispatch => ({
    providersActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete', 'create'], 'Providers'),
      createRequestAction(['delete'], 'Provider'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Providers);
};

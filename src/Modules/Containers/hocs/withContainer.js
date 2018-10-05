import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class Container extends Component {
    static displayName = 'Container (HOC)';

    static propTypes = {
      containerActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { containerActions } = this.props;

        containerActions.unloadContainer();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    container: state.containers.container.container,
    containerPending: state.containers.container.pending,
    containerImport: state.containers.containerImport.container,
    containerImportPending: state.containers.containerImport.pending,

    providers: state.containers.container.providers,
    volumes: state.containers.container.volumes,
    secrets: state.containers.container.secrets,
  });

  const mapDispatchToProps = dispatch => ({
    containerActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete', 'promote', 'migrate', 'scale', 'import', 'detach', 'poll'], 'Container'),
      createRequestAction(['fetch'], 'ProviderContainer'),
      createRequestAction(['init'], 'ContainerCreate'),
      createRequestAction(['init'], 'ContainerEdit'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Container);
};

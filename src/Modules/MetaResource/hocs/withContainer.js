import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

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
    container: state.metaResource.container.container,
    containerPending: state.metaResource.container.pending,
    containerImport: state.metaResource.containerImport.container,
    containerImportPending: state.metaResource.containerImport.pending,
  });

  const mapDispatchToProps = dispatch => ({
    containerActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete', 'promote', 'migrate', 'scale', 'import', 'detach'], 'Container'),
      createRequestAction(['fetch'], 'ProviderContainer'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Container);
};

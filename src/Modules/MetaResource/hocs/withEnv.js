import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default ({ unloadEnv = true, unloadEnvSchema = true } = {}) => (BaseComponent) => {
  class Env extends Component {
    static displayName = 'Env(HOC)';

    static propTypes = {
      envActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { envActions } = this.props;
      if (unloadEnv) {
        envActions.unloadEnv();
      }

      if (unloadEnvSchema) {
        envActions.unloadEnvSchema();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    env: state.metaResource.env.env,
    envPending: state.metaResource.env.pending,
    envSchema: state.metaResource.envSchema.schema,
    envSchemaPending: state.metaResource.envSchema.pending,
  });

  const mapDispatchToProps = dispatch => ({
    envActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch'], 'EnvSchema'),
      createRequestAction(['fetch'], 'Env'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Env);
};

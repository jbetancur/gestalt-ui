import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default ({ unloadEnv = true } = {}) => (BaseComponent) => {
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
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    env: state.env.env.env,
    envPending: state.env.env.pending,
  });

  const mapDispatchToProps = dispatch => ({
    envActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch'], 'Env'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Env);
};

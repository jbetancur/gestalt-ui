import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default ({ unload = false } = {}) => (BaseComponent) => {
  class Environment extends Component {
    static displayName = 'Environment (HOC)';

    static propTypes = {
      environmentActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { environmentActions } = this.props;

        environmentActions.unloadEnvironment();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    environment: state.hierarchy.environment.environment,
    environmentPending: state.hierarchy.environment.pending,
  });

  const mapDispatchToProps = dispatch => ({
    environmentActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'update', 'delete'], 'Environment'),
      createRequestAction(['create'], 'Environment', { entityKey: 'workspaces' }),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Environment);
};

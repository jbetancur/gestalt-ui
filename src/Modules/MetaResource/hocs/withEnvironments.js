import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default ({ unload = false } = {}) => (BaseComponent) => {
  class Environments extends Component {
    static displayName = 'Environments (HOC)';

    static propTypes = {
      environmentsActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { environmentsActions } = this.props;

        environmentsActions.unloadEnvironments();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    environments: state.metaResource.environments.environments,
    environmentsPending: state.metaResource.environments.pending,
  });

  const mapDispatchToProps = dispatch => ({
    environmentsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch'], 'Environments', { entityKey: 'workspaces' }),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Environments);
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';
import { selectAppDeployments } from '../selectors';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class AppDeployments extends Component {
    static displayName = 'AppDeployments (HOC)';

    static propTypes = {
      appDeploymentsActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { appDeploymentsActions } = this.props;

        appDeploymentsActions.unloadAppDeployments();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    appDeployments: selectAppDeployments(state),
    appDeploymentsPending: state.appDeployments.appDeployments.pending,
  });

  const mapDispatchToProps = dispatch => ({
    appDeploymentsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'delete'], 'AppDeployments'),
      createRequestAction(['delete'], 'AppDeployment'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(AppDeployments);
};

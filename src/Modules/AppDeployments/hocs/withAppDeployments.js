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
    providers: state.appDeployments.appDeployments.providers,
  });

  const mapDispatchToProps = dispatch => ({
    appDeploymentsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'AppDeployments'),
      createRequestAction(['create'], 'AppDeployment'),
      createRequestAction(['delete'], 'AppDeployment'),
      createRequestAction(['init'], 'AppDeploymentCreate'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(AppDeployments);
};

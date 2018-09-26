import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';
import { selectLambda } from '../selectors';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class Lambda extends Component {
    static displayName = 'Lambda(HOC)';

    static propTypes = {
      lambdaActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { lambdaActions } = this.props;

        lambdaActions.unloadLambda();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    lambda: selectLambda(state),
    lambdaPending: state.lambdas.lambda.pending,
    providers: state.lambdas.lambda.providers,
    executors: state.lambdas.lambda.executors,
    secrets: state.lambdas.lambda.secrets,
  });

  const mapDispatchToProps = dispatch => ({
    lambdaActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Lambda'),
      createRequestAction(['init'], 'LambdaCreate'),
      createRequestAction(['init'], 'LambdaEdit'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Lambda);
};

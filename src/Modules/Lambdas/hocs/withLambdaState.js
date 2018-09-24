import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../actions';

export default function withLambdaState(BaseComponent) {
  class LambdaState extends Component {
    static displayName = 'LambdaState(HOC)';

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    theme: state.lambdas.theme,
    selectedRuntime: state.lambdas.runtime
  });

  const mapDispatchToProps = dispatch => ({
    lambdaStateActions: bindActionCreators(Object.assign({},
      actions
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(LambdaState);
}

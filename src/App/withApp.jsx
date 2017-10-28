import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './actions';

export default function withhApp(BaseComponent) {
  class Actions extends PureComponent {
    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    const { app } = state;

    return {
      activityIndicator: app.activityIndicator.activity,
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      appActions: bindActionCreators(actions, dispatch)
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(Actions);
}

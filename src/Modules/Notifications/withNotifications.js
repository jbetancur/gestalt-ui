import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './actions';

export default () => (BaseComponent) => {
  class NotificationsHOC extends PureComponent {
    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    notificationActions: bindActionCreators(actions, dispatch)
  });

  return connect(null, mapDispatchToProps)(NotificationsHOC);
};

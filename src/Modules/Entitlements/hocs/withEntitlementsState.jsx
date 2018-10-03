import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../actions';

export default function withEntitlements(BaseComponent) {
  class EntitlementsHOC extends PureComponent {
    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    entitlementActions: bindActionCreators(actions, dispatch)
  });

  return connect(null, mapDispatchToProps)(EntitlementsHOC);
}

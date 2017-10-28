import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './actions';

export default function withHierarchy(BaseComponent) {
  class Actions extends PureComponent {
    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      hierarchyActions: bindActionCreators(actions, dispatch)
    };
  }

  return connect(null, mapDispatchToProps)(Actions);
}

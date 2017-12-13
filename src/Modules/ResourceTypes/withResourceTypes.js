import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './actions';

export default function withResourceTypes(BaseComponent) {
  class Actions extends PureComponent {
    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      resourceTypeActions: bindActionCreators(actions, dispatch)
    };
  }

  return connect(null, mapDispatchToProps)(Actions);
}

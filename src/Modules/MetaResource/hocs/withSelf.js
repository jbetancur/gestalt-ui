import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withSelf(BaseComponent) {
  class Self extends Component {
    static displayName = 'Self(HOC)';
    static propTypes = {
      selfActions: PropTypes.object.isRequired,
    };

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    self: state.metaResource.self.self,
    selfPending: state.metaResource.self.pending,
  });

  const mapDispatchToProps = dispatch => ({
    selfActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch'], 'Self'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Self);
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default function withserviceSpecs(BaseComponent) {
  class ServiceSpecs extends Component {
    static displayName = 'ServiceSpecs(HOC)';

    static propTypes = {
      serviceSpecsActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { serviceSpecsActions } = this.props;

      serviceSpecsActions.unloadServiceSpecs();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    serviceSpecs: state.serviceSpecs.serviceSpecs.serviceSpecs,
    serviceSpecsPending: state.serviceSpecs.serviceSpecs.pending,
  });

  const mapDispatchToProps = dispatch => ({
    serviceSpecsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'ServiceSpecs'),
      createRequestAction(['delete'], 'ServiceSpec'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(ServiceSpecs);
}

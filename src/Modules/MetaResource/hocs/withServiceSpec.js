import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default function withServiceSpec(BaseComponent) {
  class ServiceSpec extends Component {
    static displayName = 'ServiceSpec(HOC)';

    static propTypes = {
      serviceSpecActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { serviceSpecActions } = this.props;

      serviceSpecActions.unloadServiceSpec();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    serviceSpec: state.serviceSpecs.serviceSpec.serviceSpec,
    serviceSpecPending: state.serviceSpecs.serviceSpec.pending,
  });

  const mapDispatchToProps = dispatch => ({
    serviceSpecActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'ServiceSpec'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(ServiceSpec);
}

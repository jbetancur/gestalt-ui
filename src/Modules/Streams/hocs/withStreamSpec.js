import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default function withStreamSpec(BaseComponent) {
  class StreamSpec extends Component {
    static displayName = 'StreamSpec(HOC)';

    static propTypes = {
      streamSpecActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { streamSpecActions } = this.props;

      streamSpecActions.unloadStreamSpec();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    streamSpec: state.streamSpecs.streamSpec.streamSpec,
    streamSpecPending: state.streamSpecs.streamSpec.pending,
    providers: state.streamSpecs.streamSpec.providers,
    lambdas: state.streamSpecs.streamSpec.lambdas,
    datafeeds: state.streamSpecs.streamSpec.datafeeds,
    providerActions: state.streamSpecs.streamSpec.actions,
    instanceProviderActions: state.streamSpecs.streamSpec.instanceActions,
  });

  const mapDispatchToProps = dispatch => ({
    streamSpecActions: bindActionCreators(Object.assign({},
      createRequestAction(['init'], 'StreamSpecCreate'),
      createRequestAction(['init'], 'StreamSpecEdit'),
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'StreamSpec'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(StreamSpec);
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withapis(BaseComponent) {
  class APIs extends Component {
    static displayName = 'APIs(HOC)';

    static propTypes = {
      apisActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { apisActions } = this.props;

      apisActions.unloadAPIs();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    apis: state.metaResource.apis.apis,
    apisPending: state.metaResource.apis.pending,
  });

  const mapDispatchToProps = dispatch => ({
    apisActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'APIs'),
      createRequestAction(['delete'], 'API'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(APIs);
}

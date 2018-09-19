import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default function withAPI(BaseComponent) {
  class API extends Component {
    static displayName = 'API(HOC)';

    static propTypes = {
      apiActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { apiActions } = this.props;

      apiActions.unloadAPI();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    api: state.apis.api.api,
    apiPending: state.apis.api.pending,
  });

  const mapDispatchToProps = dispatch => ({
    apiActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'API'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(API);
}

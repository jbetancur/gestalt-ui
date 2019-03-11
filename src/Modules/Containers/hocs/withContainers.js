import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';
import { getContainers } from '../reducers/selectors';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class Containers extends Component {
    static displayName = 'Containers (HOC)';

    static propTypes = {
      containersActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { containersActions } = this.props;

        containersActions.unloadContainers();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    containers: getContainers(state),
    containersPending: state.containers.containers.pending,
  });

  const mapDispatchToProps = dispatch => ({
    containersActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete', 'poll', 'create'], 'Containers'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Containers);
};

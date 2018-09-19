import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default ({ unload = false } = {}) => (BaseComponent) => {
  class Workspaces extends Component {
    static displayName = 'Workspaces (HOC)';

    static propTypes = {
      workspacesActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { workspacesActions } = this.props;

        workspacesActions.unloadWorkspaces();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    workspaces: state.hierarchy.workspaces.workspaces,
    workspacesPending: state.hierarchy.workspaces.pending,
  });

  const mapDispatchToProps = dispatch => ({
    workspacesActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch'], 'Workspaces'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Workspaces);
};

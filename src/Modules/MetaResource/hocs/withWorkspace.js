import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default ({ unload = false } = {}) => (BaseComponent) => {
  class Workspace extends Component {
    static displayName = 'Workspace (HOC)';

    static propTypes = {
      workspaceActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { workspaceActions } = this.props;

        workspaceActions.unloadWorkspace();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    workspace: state.hierarchy.workspace.workspace,
    workspacePending: state.hierarchy.workspace.pending,
  });

  const mapDispatchToProps = dispatch => ({
    workspaceActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'update', 'delete'], 'Workspace'),
      createRequestAction(['create'], 'Workspace'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Workspace);
};

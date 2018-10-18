import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import WorkspaceRoutes from '../routes/WorkspaceRoutes';
import withContext from '../hocs/withContext';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      match,
      contextActions,
    } = this.props;

    contextActions.fetchContext({
      fqon: match.params.fqon,
      workspaceId: match.params.workspaceId,
      context: 'workspace',
    });
  }

  componentDidUpdate(prevProps) {
    const { match, contextActions } = this.props;

    if (match.params.workspaceId && prevProps.match.params.workspaceId !== match.params.workspaceId) {
      // If the workspace is switched then get the updated context
      contextActions.fetchContext({
        fqon: match.params.fqon,
        workspaceId: match.params.workspaceId,
        context: 'workspace',
      });
    }
  }

  render() {
    return <WorkspaceRoutes />;
  }
}

export default compose(
  withContext(),
)(WorkspaceContext);

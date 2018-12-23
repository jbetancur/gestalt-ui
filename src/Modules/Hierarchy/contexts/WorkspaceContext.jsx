import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import WorkspaceRoutes from '../routes/WorkspaceRoutes';
import withContext from '../hocs/withContext';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      match,
      hierarchyContextActions,
    } = this.props;

    hierarchyContextActions.fetchContext({
      fqon: match.params.fqon,
      workspaceId: match.params.workspaceId,
      context: 'workspace',
    });
  }

  componentDidUpdate(prevProps) {
    const { match, hierarchyContextActions } = this.props;

    if (match.params.workspaceId && prevProps.match.params.workspaceId !== match.params.workspaceId) {
      // If the workspace is switched then get the updated context
      hierarchyContextActions.fetchContext({
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

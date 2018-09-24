import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Div from 'components/Div';
import WorkspaceRoutes from '../routes/WorkspaceRoutes';
import WorkspaceNav from '../containers/WorkspaceNav';
import WorkspaceHeader from '../containers/WorkspaceHeader';
import withContext from '../hocs/withContext';

class WorkspaceContext extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      match,
      contextActions,
    } = this.props;

    contextActions.fetchContext({
      fqon: match.params.fqon,
      id: match.params.workspaceId,
      context: 'workspace',
    });
  }

  componentDidUpdate(prevProps) {
    const { match, contextActions } = this.props;

    if (match.params.workspaceId && prevProps.match.params.workspaceId !== match.params.workspaceId) {
      // If the workspace is switched then get the updated context
      contextActions.fetchContext({
        fqon: match.params.fqon,
        id: match.params.workspaceId,
        context: 'workspace',
      });
    }
  }

  render() {
    const { context: { workspace } } = this.props;

    return (
      <Div>
        <WorkspaceNav />
        <Div paddingLeft="5em" paddingBottom="56px">
          <WorkspaceHeader
            model={workspace}
            {...this.props}
          />
          <WorkspaceRoutes />
        </Div>
      </Div>
    );
  }
}

export default compose(
  withContext(),
)(WorkspaceContext);

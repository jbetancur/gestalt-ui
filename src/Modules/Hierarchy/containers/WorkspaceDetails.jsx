import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon, WorkspaceIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../hocs/withHierarchy';
import withContext from '../hocs/withContext';

class WorkspaceDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { context: { workspace }, match, entitlementActions } = this.props;

    const name = workspace.description || workspace.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, workspace.id, 'workspaces', 'Workspace');
  }

  delete = () => {
    const { context: { workspace }, match, history, contextActions, hierarchyActions } = this.props;
    const name = workspace.description || workspace.name;
    const onSuccess = () =>
      history.replace(`/${match.params.fqon}/hierarchy`);

    hierarchyActions.confirmDelete(({ force }) => {
      contextActions.deleteWorkspace({ fqon: match.params.fqon, resource: workspace, onSuccess, params: { force } });
    }, name, 'Workspace');
  }

  renderActions() {
    const { match } = this.props;

    return (
      <React.Fragment>
        <Button
          flat
          iconChildren={<DeleteIcon />}
          onClick={this.delete}
        >
          Delete
        </Button>
        <Button
          flat
          iconChildren="edit"
          component={Link}
          to={{ pathname: `${match.url}/edit`, state: { modal: true } }}
        >
          Edit
        </Button>
        <Button
          flat
          iconChildren={<EntitlementIcon size={20} />}
          onClick={this.showEntitlements}
        >
          Entitlements
        </Button>
      </React.Fragment>
    );
  }

  render() {
    const { context: { workspace } } = this.props;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={workspace.description || workspace.name}
          titleIcon={<WorkspaceIcon />}
          actions={this.renderActions()}
        />
        <DetailsPane model={workspace} />
      </React.Fragment>
    );
  }
}

export default compose(
  withContext(),
  withHierarchy,
  withEntitlements,
)(WorkspaceDetails);

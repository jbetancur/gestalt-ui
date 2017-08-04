import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DeleteIcon } from 'components/Icons';
import { Button } from 'components/Buttons';

class WorkspaceActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    deleteWorkspace: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    showEntitlementsModal: PropTypes.func.isRequired,
  };

  delete() {
    const { match, history, workspace, deleteWorkspace } = this.props;

    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);
    this.props.confirmDelete(() => {
      deleteWorkspace(match.params.fqon, workspace.id, onSuccess);
    }, workspace.description || workspace.name, 'Workspace');
  }

  render() {
    const { workspace, pending, match } = this.props;
    const name = workspace.description || workspace.name;

    return (
      <div style={{ display: 'inline' }}>
        <Button
          flat
          label="Create"
          component={Link}
          to={`/${match.params.fqon}/hierarchy/${workspace.id}/createEnvironment`}
          disabled={pending}
        >
          create_new_folder
        </Button>
        <Button
          flat
          label={<span>Edit</span>}
          component={Link}
          to={`/${match.params.fqon}/hierarchy/${workspace.id}/editWorkspace`}
          disabled={pending}
        >
          edit
        </Button>
        <Button
          flat
          label={<span>Entitlements</span>}
          onClick={() => this.props.showEntitlementsModal(name, match.params, 'Workspace')}
          disabled={pending}
        >
          security
        </Button>
        <Button
          flat
          label={<span>Delete</span>}
          leftIcon={<DeleteIcon />}
          onClick={e => this.delete(e)}
          disabled={pending}
        >
          <DeleteIcon />
        </Button>
      </div>
    );
  }
}

export default WorkspaceActions;

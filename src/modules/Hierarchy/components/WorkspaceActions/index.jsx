import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DeleteIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';

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
      <Div display="inline" disabled={pending}>
        <Button
          flat
          label="Create"
          component={Link}
          to={`/${match.params.fqon}/hierarchy/${workspace.id}/createEnvironment`}
        >
          create_new_folder
        </Button>
        <Button
          flat
          label={<span>Edit</span>}
          component={Link}
          to={`/${match.params.fqon}/hierarchy/${workspace.id}/editWorkspace`}
        >
          edit
        </Button>
        <Button
          flat
          label={<span>Entitlements</span>}
          onClick={() => this.props.showEntitlementsModal(name, match.params, 'Workspace')}
        >
          security
        </Button>
        <Button
          flat
          label={<span>Delete</span>}
          leftIcon={<DeleteIcon />}
          onClick={e => this.delete(e)}
        >
          <DeleteIcon />
        </Button>
      </Div>
    );
  }
}

export default WorkspaceActions;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import { DeleteIcon, ProviderIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';

const listItemStyle = { textAlign: 'left' };

class WorkspaceActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    deleteWorkspace: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    showEntitlementsModal: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
  };

  delete() {
    const { history, workspace, deleteWorkspace } = this.props;

    const onSuccess = () => history.replace(`/${workspace.org.properties.fqon}/hierarchy`);
    this.props.confirmDelete(() => {
      deleteWorkspace(workspace.org.properties.fqon, workspace.id, onSuccess);
    }, workspace.description || workspace.name, 'Workspace');
  }

  render() {
    const { workspace, pending, match, handleNavigation } = this.props;
    const name = workspace.description || workspace.name;

    return (
      <Div display="inline" disabled={pending}>
        <MenuButton
          id="workspace-settings-menu"
          position="below"
          buttonChildren="add"
          flat
          contained={false}
          label="Create"
        >
          <ListItem
            id="workspace-settings-menu--environment-create"
            primaryText="Environment"
            component={Link}
            leftIcon={<FontIcon>folder</FontIcon>}
            to={`/${workspace.org.properties.fqon}/hierarchy/${workspace.id}/createEnvironment`}
            style={listItemStyle}
          />
          <ListItem
            id="workspace-settings-menu--provider-create"
            primaryText="Provider"
            component={Link}
            leftIcon={<ProviderIcon />}
            to={`/${workspace.org.properties.fqon}/hierarchy/${match.params.workspaceId}/providers/create`}
            onClick={() => handleNavigation('workspace', 'providers', 1)}
            style={listItemStyle}
          />
        </MenuButton>
        <Button
          flat
          label={<span>Edit</span>}
          component={Link}
          to={`/${workspace.org.properties.fqon}/hierarchy/${workspace.id}/editWorkspace`}
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

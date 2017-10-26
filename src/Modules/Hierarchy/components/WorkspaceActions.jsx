import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import { DeleteIcon } from 'components/Icons';
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
  };

  delete() {
    const { match, history, workspace, deleteWorkspace } = this.props;
    const name = workspace.description || workspace.name;
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);

    this.props.confirmDelete(() => {
      deleteWorkspace(match.params.fqon, workspace.id, onSuccess);
    }, name, 'Workspace');
  }

  render() {
    const { workspace, pending, match } = this.props;
    const name = workspace.description || workspace.name;

    return (
      <Div display="inline" disabled={pending}>
        <MenuButton
          id="workspace-settings-menu"
          position="below"
          iconChildren="add"
          flat
          sameWidth={false}
          label="Create"
        >
          <ListItem
            id="workspace-settings-menu--environment-create"
            primaryText="Environment"
            component={Link}
            leftIcon={<FontIcon>folder</FontIcon>}
            to={`${match.url}/createEnvironment`}
            style={listItemStyle}
          />
          <ListItem
            id="workspace-settings-menu--provider-create"
            primaryText="Provider"
            component={Link}
            leftIcon={<FontIcon>settings_applications</FontIcon>}
            to={`${match.url}/createProvider`}
            style={listItemStyle}
          />
        </MenuButton>
        <Button
          flat
          iconChildren="edit"
          component={Link}
          to={`${match.url}/edit`}
        >
        Edit
        </Button>
        <Button
          flat
          iconChildren="security"
          onClick={() => this.props.showEntitlementsModal(name, match.params, 'Workspace')}
        >
        Entitlements
        </Button>
        <Button
          flat
          iconChildren={<DeleteIcon />}
          onClick={e => this.delete(e)}
        >
          Delete
        </Button>
      </Div>
    );
  }
}

export default WorkspaceActions;

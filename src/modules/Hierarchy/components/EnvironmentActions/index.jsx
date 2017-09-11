import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import { DeleteIcon, LambdaIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';

const listItemStyle = { textAlign: 'left' };

class EnvironmentActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    deleteEnvironment: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    showEntitlementsModal: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
  };

  delete() {
    const { match, history, environment, deleteEnvironment } = this.props;
    const name = environment.description || environment.name;
    const onSuccess = () => history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}`);

    this.props.confirmDelete(() => {
      deleteEnvironment(match.params.fqon, environment.id, onSuccess);
    }, name, 'Environment');
  }

  render() {
    const { environment, pending, match, handleNavigation } = this.props;
    const name = environment.description || environment.name;

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
            id="workspace-settings-menu--container-create"
            primaryText="Container"
            component={Link}
            leftIcon={<FontIcon>memory</FontIcon>}
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/containers/create`}
            onClick={() => handleNavigation('environment', 'containers', 0)}
            style={listItemStyle}
          />
          <ListItem
            id="workspace-settings-menu--lambda-create"
            primaryText="Lambda"
            component={Link}
            leftIcon={<LambdaIcon />}
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/lambdas/create`}
            onClick={() => handleNavigation('environment', 'lambdas', 1)}
            style={listItemStyle}
          />
          <ListItem
            id="environment-settings-menu--apis-create"
            primaryText="API"
            component={Link}
            leftIcon={<FontIcon>device_hub</FontIcon>}
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/create`}
            onClick={() => handleNavigation('environment', 'apis', 2)}
            style={listItemStyle}
          />
          <ListItem
            id="environment-settings-menu--policies-create"
            primaryText="Policy"
            component={Link}
            leftIcon={<FontIcon>verified_user</FontIcon>}
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/create`}
            onClick={() => handleNavigation('environment', 'policies', 3)}
            style={listItemStyle}
          />
          <ListItem
            id="environment-settings-menu--provider-create"
            primaryText="Provider"
            component={Link}
            leftIcon={<FontIcon>settings_applications</FontIcon>}
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/providers/create`}
            onClick={() => handleNavigation('environment', 'providers', 4)}
            style={listItemStyle}
          />
        </MenuButton>
        <Button
          flat
          iconChildren="edit"
          component={Link}
          to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/edit`}
        >
          Edit
        </Button>
        <Button
          flat
          iconChildren="security"
          onClick={() => this.props.showEntitlementsModal(name, match.params, 'Environment')}
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

export default EnvironmentActions;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import { DeleteIcon, LambdaIcon, ContainerIcon } from 'components/Icons';
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
  };

  delete = () => {
    const { match, history, environment, deleteEnvironment } = this.props;
    const name = environment.description || environment.name;
    const onSuccess = () => history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments`);

    this.props.confirmDelete(() => {
      deleteEnvironment(match.params.fqon, environment.id, onSuccess);
    }, name, 'Environment');
  }

  render() {
    const { environment, pending, match } = this.props;
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
            leftIcon={<ContainerIcon />}
            to={`${match.url}/containers/create`}
            style={listItemStyle}
          />
          <ListItem
            id="workspace-settings-menu--lambda-create"
            primaryText="Lambda"
            component={Link}
            leftIcon={<LambdaIcon />}
            to={`${match.url}/lambdas/create`}
            style={listItemStyle}
          />
          <ListItem
            id="environment-settings-menu--apis-create"
            primaryText="API"
            component={Link}
            leftIcon={<FontIcon>device_hub</FontIcon>}
            to={`${match.url}/apis/create`}
            style={listItemStyle}
          />
          <ListItem
            id="environment-settings-menu--policies-create"
            primaryText="Policy"
            component={Link}
            leftIcon={<FontIcon>verified_user</FontIcon>}
            to={`${match.url}/policies/create`}
            style={listItemStyle}
          />
          <ListItem
            id="environment-settings-menu--provider-create"
            primaryText="Provider"
            component={Link}
            leftIcon={<FontIcon>settings_applications</FontIcon>}
            to={`${match.url}/providers/create`}
            style={listItemStyle}
          />
          <ListItem
            id="environment-settings-menu--secret-create"
            primaryText="Secret"
            component={Link}
            leftIcon={<FontIcon>lock</FontIcon>}
            to={`${match.url}/secrets/create`}
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
          onClick={() => this.props.showEntitlementsModal(name, match.params, 'Environment')}
        >
          Entitlements
        </Button>
        <Button
          flat
          iconChildren={<DeleteIcon />}
          onClick={this.delete}
        >
          Delete
        </Button>
      </Div>
    );
  }
}

export default EnvironmentActions;

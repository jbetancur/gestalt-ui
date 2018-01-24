import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { withEntitlements } from 'Modules/Entitlements';
import { ListItem, FontIcon, MenuButton } from 'react-md';
import { LambdaIcon, ContainerIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';

const listItemStyle = { textAlign: 'left' };

class EnvironmentActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { environment, match, entitlementActions } = this.props;

    const name = environment.description || environment.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, environment.id, 'environments', 'Environment');
  }

  render() {
    const { pending, match } = this.props;

    const menuItems = [
      <ListItem
        id="workspace-settings-menu--container-create"
        key="workspace-settings-menu--container-create"
        primaryText="Container"
        component={Link}
        leftIcon={<ContainerIcon />}
        to={`${match.url}/containers/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="workspace-settings-menu--lambda-create"
        key="workspace-settings-menu--lambda-create"
        primaryText="Lambda"
        component={Link}
        leftIcon={<LambdaIcon />}
        to={`${match.url}/lambdas/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="environment-settings-menu--apis-create"
        key="environment-settings-menu--apis-create"
        primaryText="API"
        component={Link}
        leftIcon={<FontIcon>device_hub</FontIcon>}
        to={`${match.url}/apis/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="environment-settings-menu--policies-create"
        key="environment-settings-menu--policies-create"
        primaryText="Policy"
        component={Link}
        leftIcon={<FontIcon>verified_user</FontIcon>}
        to={`${match.url}/policies/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="environment-settings-menu--provider-create"
        key="environment-settings-menu--provider-create"
        primaryText="Provider"
        component={Link}
        leftIcon={<FontIcon>settings_applications</FontIcon>}
        to={`${match.url}/providers/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="environment-settings-menu--secret-create"
        key="environment-settings-menu--secret-create"
        primaryText="Secret"
        component={Link}
        leftIcon={<FontIcon>lock</FontIcon>}
        to={`${match.url}/secrets/create`}
        style={listItemStyle}
      />
    ];

    return (
      <Div display="inline" disabled={pending}>
        <MenuButton
          id="workspace-settings-menu"
          position="below"
          iconChildren="add"
          flat
          sameWidth={false}
          label="Create"
          menuItems={menuItems}
        />
        <Button
          flat
          iconChildren="security"
          onClick={this.showEntitlements}
        >
          Entitlements
        </Button>
      </Div>
    );
  }
}

export default compose(
  withEntitlements
)(EnvironmentActions);

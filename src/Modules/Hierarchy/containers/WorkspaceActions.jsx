import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { Link } from 'react-router-dom';
import { ProviderIcon, EntitlementIcon, EnvironmentIcon } from 'components/Icons';
import { ListItem, MenuButton } from 'react-md';
import { Button } from 'components/Buttons';
import Div from 'components/Div';

const listItemStyle = { textAlign: 'left' };

class WorkspaceActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { workspace, match, entitlementActions } = this.props;

    const name = workspace.description || workspace.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, workspace.id, 'workspaces', 'Workspace');
  }

  render() {
    const { pending, match } = this.props;

    const menuItems = [
      <ListItem
        id="workspace-settings-menu--environment-create"
        key="workspace-settings-menu--environment-create"
        primaryText="Environment"
        component={Link}
        leftIcon={<EnvironmentIcon />}
        to={{ pathname: `${match.url}/createEnvironment`, state: { modal: true } }}
        style={listItemStyle}
      />,
      <ListItem
        id="workspace-settings-menu--provider-create"
        key="workspace-settings-menu--provider-create"
        primaryText="Provider"
        component={Link}
        leftIcon={<ProviderIcon />}
        to={`${match.url}/createProvider`}
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
        >
          Create
        </MenuButton>
        <Button
          flat
          iconChildren={<EntitlementIcon size={20} />}
          onClick={this.showEntitlements}
        >
        Entitlements
        </Button>
      </Div>
    );
  }
}

export default compose(
  withMetaResource,
  withEntitlements,
)(WorkspaceActions);

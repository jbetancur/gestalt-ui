import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { ProviderIcon, EnvironmentIcon } from 'components/Icons';
import { ListItem, MenuButton } from 'react-md';
import Div from 'components/Div';

const listItemStyle = { textAlign: 'left' };

class WorkspaceActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
  };

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
          anchor={{
            x: MenuButton.HorizontalAnchors.CENTER,
            y: MenuButton.VerticalAnchors.CENTER,
          }}
          iconChildren="add"
          flat
          sameWidth={false}
          label="Create"
          menuItems={menuItems}
        >
          Create
        </MenuButton>
      </Div>
    );
  }
}

export default compose(
)(WorkspaceActions);

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { ListItem, MenuButton } from 'react-md';
import { LambdaIcon, ContainerIcon, APIIcon, PolicyIcon, ProviderIcon, SecretIcon, StreamIcon, DataFeedIcon } from 'components/Icons';
import Div from 'components/Div';
import withApp from 'App/withApp';

const listItemStyle = { textAlign: 'left' };

class EnvironmentActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    appState: PropTypes.object.isRequired,
  };

  render() {
    const { pending, match, appState } = this.props;

    const menuItems = [
      <ListItem
        id="environment-settings-menu--container-create"
        key="environment-settings-menu--container-create"
        primaryText="Container"
        component={Link}
        leftIcon={<ContainerIcon />}
        to={`${match.url}/containers/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="environment-settings-menu--lambda-create"
        key="environment-settings-menu--lambda-create"
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
        leftIcon={<APIIcon />}
        to={`${match.url}/apis/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="environment-settings-menu--policies-create"
        key="environment-settings-menu--policies-create"
        primaryText="Policy"
        component={Link}
        leftIcon={<PolicyIcon />}
        to={`${match.url}/policies/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="environment-settings-menu--provider-create"
        key="environment-settings-menu--provider-create"
        primaryText="Provider"
        component={Link}
        leftIcon={<ProviderIcon />}
        to={`${match.url}/providers/create`}
        style={listItemStyle}
      />,
      <ListItem
        id="environment-settings-menu--secret-create"
        key="environment-settings-menu--secret-create"
        primaryText="Secret"
        component={Link}
        leftIcon={<SecretIcon />}
        to={`${match.url}/secrets/create`}
        style={listItemStyle}
      />,
      appState.enableExperimental ?
        <ListItem
          id="environment-settings-menu--stream-create"
          key="environment-settings-menu--stream-create"
          primaryText="Stream"
          component={Link}
          leftIcon={<StreamIcon />}
          to={`${match.url}/streams/create`}
          style={listItemStyle}
        /> : <div key="environment-settings-menu--stream-create" />,
      appState.enableExperimental ?
        <ListItem
          id="environment-settings-menu--datafeed-create"
          key="environment-settings-menu--datafeed-create"
          primaryText="Data Feed"
          component={Link}
          leftIcon={<DataFeedIcon />}
          to={`${match.url}/datafeeds/create`}
          style={listItemStyle}
        /> : <div key="environment-settings-menu--datafeed-create" />,
    ];

    return (
      <Div display="inline" disabled={pending}>
        <MenuButton
          id="environment-settings-menu"
          anchor={{
            x: MenuButton.HorizontalAnchors.CENTER,
            y: MenuButton.VerticalAnchors.CENTER,
          }}
          iconChildren="add"
          flat
          sameWidth={false}
          menuItems={menuItems}
          listHeightRestricted={false}
        >
          Create
        </MenuButton>
      </Div>
    );
  }
}

export default compose(
  withApp,
)(EnvironmentActions);

import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { FontIcon, MenuButton, ListItem, Divider } from 'react-md';
import A from 'components/A';
import { UI_VERSION, DOCUMENTATION_URL } from '../../constants';

const AppToolbarInfoMenu = (props) => {
  const menuItems = [
    <ListItem
      id="main--info--menu--version"
      key="main--info--menu--version"
      primaryText={`Ui v${UI_VERSION}`}
      leftIcon={<FontIcon>info_outline</FontIcon>}
      inkDisabled
    />,
    <Divider key="main--info--menu--divider" />,
    <ListItem
      id="main--info--menu--documentation"
      key="main--info--menu--documentation"
      primaryText={props.t('documentation.title')}
      leftIcon={<FontIcon>library_books</FontIcon>}
      component={A}
      href={DOCUMENTATION_URL}
      target="_blank"
      rel="noopener noreferrer"
      inkDisabled
    />,
    <ListItem
      id="main--info--menu--licensing"
      key="main--info--menu--licensing"
      primaryText="Licensing"
      leftIcon={<FontIcon>vpn_key</FontIcon>}
      onClick={props.onShowLicenseModal}
    />,
  ];

  return (
    <MenuButton
      id="info-menu"
      icon
      position={MenuButton.Positions.TOP_RIGHT}
      menuItems={menuItems}
    >
      info_outline
    </MenuButton>
  );
};

AppToolbarInfoMenu.propTypes = {
  t: PropTypes.func.isRequired,
  onShowLicenseModal: PropTypes.func.isRequired,
};

export default translate()(AppToolbarInfoMenu);

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { FontIcon, MenuButton, ListItem, Divider } from 'react-md';
import { A } from 'components/Links';
import { GalacticFogIcon } from 'components/Icons';
import { UI_VERSION, DOCUMENTATION_URL, APP_TITLE } from '../../constants';
import withApp from '../hocs/withApp';

const AppToolbarInfoMenu = (props) => {
  const menuItems = [
    <ListItem
      id="main--info--menu--product"
      key="main--info--menu--product"
      primaryText={APP_TITLE}
      secondaryText={`v${UI_VERSION}`}
      leftAvatar={<GalacticFogIcon size={40} fill="#222639" />}
      inkDisabled
    />,
    props.appState.enableExperimental ?
      <ListItem
        id="main--info--menu--upgrade"
        key="main--info--menu--upgrade"
        primaryText="Upgrade"
        leftIcon={<FontIcon>system_update_alt</FontIcon>}
        component={Link}
        to="/upgrade"
      /> : <div key="main--info--menu--upgrade" />,
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
      id="main--info--menu"
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
  appState: PropTypes.object.isRequired,
};

export default translate()(withApp(AppToolbarInfoMenu));

import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { FontIcon, MenuButton, ListItem } from 'react-md';
import { A } from 'components/Links';
import Divider from 'components/Divider';
import { GalacticFogIcon } from 'components/Icons';
import { LicenseModal } from 'Modules/Licensing';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import { UI_VERSION, DOCUMENTATION_URL, APP_TITLE } from '../../../constants';

const AppToolbarInfoMenu = memo(({ t }) => {
  const { showModal } = useContext(ModalContext);

  const menuItems = [
    <ListItem
      id="main--info--menu--product"
      key="main--info--menu--product"
      primaryText={APP_TITLE}
      secondaryText={`ui v${UI_VERSION}`}
      leftAvatar={<GalacticFogIcon size={40} fill="#222639" />}
      inkDisabled
    />,
    <ListItem
      id="main--info--menu--upgrade"
      key="main--info--menu--upgrade"
      primaryText="Upgrade"
      leftIcon={<FontIcon>system_update_alt</FontIcon>}
      component={Link}
      to="/upgrade"
    />,
    <Divider key="main--info--menu--divider" />,
    <ListItem
      id="main--info--menu--documentation"
      key="main--info--menu--documentation"
      primaryText={t('documentation.title')}
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
      onClick={() => showModal(LicenseModal)}
    />,
  ];

  return (
    <MenuButton
      id="main--info--menu"
      icon
      anchor={{
        x: MenuButton.HorizontalAnchors.INNER_RIGHT,
        y: MenuButton.VerticalAnchors.BOTTOM,
      }}
      simplifiedMenu={false}
      menuItems={menuItems}
    >
      info_outline
    </MenuButton>
  );
});

AppToolbarInfoMenu.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate()(AppToolbarInfoMenu);

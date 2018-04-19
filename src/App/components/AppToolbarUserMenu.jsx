import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18next from 'i18next';
import { FontIcon, MenuButton, ListItem, Divider, Avatar } from 'react-md';
import { USEnglishLangIcon, UserIcon } from 'components/Icons';

const AppToolbarUserMenu = (props) => {
  const { self, browser, t, onLogout, } = props;
  const renderAvatar = iconSized =>
    <Avatar iconSized={iconSized}>{self.name && self.name.substring(0, 1).toUpperCase()}</Avatar>;
  const menuItems = [
    <ListItem
      id="main--user--menu--profile"
      key="main--user--menu--profile"
      primaryText={self.name || ''}
      leftAvatar={renderAvatar(true)}
      component={Link}
      to={`/${self.properties.gestalt_home.properties.fqon}/users/${self.id}`}
    />,
    <ListItem
      id="main--user--menu--locale"
      key="main--user--menu--locale"
      primaryText={t('general.nouns.language')}
      leftIcon={<FontIcon>language</FontIcon>}
      nestedItems={[
        <ListItem
          primaryText="English"
          leftIcon={<USEnglishLangIcon />}
          key={0}
          onClick={() => i18next.changeLanguage('en')}
        />,
      ]}
    />,
    <Divider key="main--user--menu--divider" />,
    <ListItem
      id="main--user--menu--logout"
      key="main--user--menu--logout"
      primaryText={t('auth.logout')}
      leftIcon={<FontIcon>power_settings_new</FontIcon>}
      onClick={onLogout}
    />,
  ];
  return (
    <MenuButton
      id="main--user--menu"
      style={{ textTransform: 'none' }}
      flat={browser.greaterThan.xs}
      icon={browser.lessThan.sm}
      iconChildren={browser.lessThan.sm ? <UserIcon /> : 'expand_more'}
      position={browser.lessThan.sm ? MenuButton.Positions.TOP_RIGHT : MenuButton.Positions.BELOW}
      iconBefore={false}
      menuItems={menuItems}
    >
      {browser.greaterThan.xs && self.name}
    </MenuButton>
  );
};

AppToolbarUserMenu.propTypes = {
  t: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  self: PropTypes.object.isRequired,
  browser: PropTypes.object.isRequired,
};

export default translate()(AppToolbarUserMenu);

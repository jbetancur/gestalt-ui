import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18next from 'i18next';
import { USEnglishLangIcon, UserIcon } from 'components/Icons';
import {
  Avatar,
  FontIcon,
  AccessibleFakeButton,
  IconSeparator,
  DropdownMenu,
  ListItem,
  Divider,
} from 'react-md';

const DDmenuStyle = styled(DropdownMenu)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserMenu = ({ simplifiedMenu, self, browser, t, onLogout }) => {
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
    <DDmenuStyle
      id={`${!simplifiedMenu ? 'smart-' : ''}avatar-dropdown-menu`}
      menuItems={menuItems}
      anchor={{
        x: DropdownMenu.HorizontalAnchors.CENTER,
        y: DropdownMenu.VerticalAnchors.BOTTOM,
      }}
      position={DropdownMenu.Positions.BELOW}
      animationPosition="below"
      simplifiedMenu={simplifiedMenu}
    >
      <AccessibleFakeButton
        component={IconSeparator}
        iconBefore
        label={
          <IconSeparator label={browser.greaterThan.xs && self.name}>
            {browser.lessThan.sm ? <UserIcon inherit /> : <FontIcon inherit>arrow_drop_down</FontIcon>}
          </IconSeparator>
        }
      />
    </DDmenuStyle>
  );
};

UserMenu.propTypes = {
  simplifiedMenu: PropTypes.bool,
  t: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  self: PropTypes.object.isRequired,
  browser: PropTypes.object.isRequired,
};

UserMenu.defaultProps = {
  simplifiedMenu: false,
};

export default translate()(UserMenu);

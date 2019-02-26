import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18next from 'i18next';
import { USEnglishLangIcon, UserIcon } from 'components/Icons';
import {
  Avatar,
  FontIcon,
  MenuButton,
  ListItem,
  Divider,
} from 'react-md';
import withSelf from '../../../App/hocs/withSelf';

const AvatarStyled = styled(Avatar)`
  .md-avatar-content {
    margin-left: -5px;
  }
`;

const UserMenu = ({ self, onLogout }) => {
  const { t } = useTranslation();

  const menuItems = [
    <ListItem
      id="main--user--menu--profile"
      key="main--user--menu--profile"
      primaryText={self.name || ''}
      leftAvatar={<AvatarStyled iconSized>{self.name && self.name.substring(0, 1).toUpperCase()}</AvatarStyled>}
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
      id="main--info--menu"
      icon
      menuItems={menuItems}
      anchor={{
        x: MenuButton.HorizontalAnchors.INNER_RIGHT,
        y: MenuButton.VerticalAnchors.BOTTOM,
      }}
      simplifiedMenu={false}
    >
      <UserIcon />
    </MenuButton>
  );
};

UserMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
  self: PropTypes.object.isRequired,
};

export default withSelf(UserMenu);

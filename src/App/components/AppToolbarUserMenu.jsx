import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18next from 'i18next';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Avatar from 'react-md/lib/Avatars';
import Divider from 'react-md/lib/Dividers';
import { USEnglishLangIcon } from 'components/Icons';

const AppToolbarUserMenu = (props) => {
  const { self, browser, t, onLogout, } = props;
  const renderAvatar = iconSized =>
    <Avatar iconSized={iconSized}>{self.name && self.name.substring(0, 1).toUpperCase()}</Avatar>;
  return (
    <MenuButton
      id="main-menu"
      flat={browser.greaterThan.xs}
      icon={browser.lessThan.sm}
      label={browser.greaterThan.xs && self.name}
      iconChildren={browser.lessThan.sm ? 'person' : 'expand_more'}
      position={browser.lessThan.sm ? MenuButton.Positions.TOP_RIGHT : MenuButton.Positions.BELOW}
      iconBefore={false}
    >
      <ListItem
        id="main-menu--profile"
        primaryText={self.name || ''}
        leftAvatar={renderAvatar(true)}
        component={Link}
        to={`/${self.properties.gestalt_home.properties.fqon}/users/${self.id}`}
      />
      <ListItem
        id="main-menu--locale"
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
      />
      <Divider />
      <ListItem
        id="main-menu--logout"
        primaryText={t('auth.logout')}
        leftIcon={<FontIcon>power_settings_new</FontIcon>}
        onClick={onLogout}
      />
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

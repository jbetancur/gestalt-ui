import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import { UI_VERSION, DOCUMENTATION_URL } from '../../constants';

const AppToolbarInfoMenu = props => (
  <MenuButton
    id="info-menu"
    icon
    iconChildren="info_outline"
    position={MenuButton.Positions.TOP_RIGHT}
  >
    <ListItem
      primaryText={`Ui v${UI_VERSION}`}
      leftIcon={<FontIcon>info_outline</FontIcon>}
    />
    <Divider />
    <ListItem
      primaryText={props.t('documentation.title')}
      leftIcon={<FontIcon>library_books</FontIcon>}
      component={styled.a`text-decoration: none;`}
      href={DOCUMENTATION_URL}
      target="_blank"
      rel="noopener noreferrer"
      inkDisabled
    />
    <ListItem
      primaryText="Licensing"
      leftIcon={<FontIcon>vpn_key</FontIcon>}
      onClick={props.onShowLicenseModal}
    />
  </MenuButton>
);

AppToolbarInfoMenu.propTypes = {
  t: PropTypes.func.isRequired,
  onShowLicenseModal: PropTypes.func.isRequired,
};

export default translate()(AppToolbarInfoMenu);

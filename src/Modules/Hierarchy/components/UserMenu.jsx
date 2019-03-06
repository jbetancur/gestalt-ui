import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MenuButton from 'components/Menus/MenuButton';
import Avatar from '@material-ui/core/Avatar';
import { UserIcon } from 'components/Icons';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import withSelf from '../../../App/hocs/withSelf';

const AvatarStyle = styled(Avatar)`
  height: 32px !important;
  width: 32px !important;
`;

const UserMenu = ({ self, onLogout }) => {
  const name = self.properties.firstName === self.properties.lastName
    ? self.properties.firstName
    : `${self.properties.firstName} ${self.properties.lastName}`;

  return (
    <MenuButton
      id="main--user--menu"
      icon={<AvatarStyle>{self.name && self.name.substring(0, 1).toUpperCase()}</AvatarStyle>}
    >
      <ListItem dense button component={Link} to={`/${self.properties.gestalt_home.properties.fqon}/users/${self.id}`}>
        <UserIcon fontSize="small" color="action" />
        <ListItemText primary={name} secondary={self.name} />
      </ListItem>

      <Divider />

      <ListItem dense button onClick={onLogout}>
        <LogoutIcon fontSize="small" color="action" />
        <ListItemText primary="Logout" />
      </ListItem>
    </MenuButton>
  );
};

UserMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
  self: PropTypes.object.isRequired,
};

export default withSelf(UserMenu);

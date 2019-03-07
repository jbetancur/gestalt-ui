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
import { withUserProfile } from 'Modules/UserProfile';
import withSelf from '../../../App/hocs/withSelf';

const AvatarStyle = styled(Avatar)`
  height: 32px !important;
  width: 32px !important;
`;

const Img = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
`;

const UserMenu = ({ self, userProfile, onLogout }) => {
  const name = self.properties.firstName === self.properties.lastName
    ? self.properties.firstName
    : `${self.properties.firstName} ${self.properties.lastName}`;

  const avatarInit = self.name && self.name.substring(0, 1).toUpperCase();
  const avatarImgSrg = userProfile.properties.avatar;
  const avatarIcon = userProfile.properties.avatar
    ? <Img src={avatarImgSrg} alt={name} align="right" />
    : avatarInit;

  const menuIcon = avatarImgSrg
    ? avatarIcon
    : <UserIcon fontSize="small" color="action" />;

  return (
    <MenuButton
      id="main--user--menu"
      icon={<AvatarStyle>{avatarIcon}</AvatarStyle>}
    >
      <ListItem dense button component={Link} to={`/${self.properties.gestalt_home.properties.fqon}/users/${self.id}`}>
        {menuIcon}
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
  userProfile: PropTypes.object.isRequired,
};

export default withSelf(withUserProfile(UserMenu));

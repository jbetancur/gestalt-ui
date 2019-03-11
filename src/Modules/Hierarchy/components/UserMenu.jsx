import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MenuButton from 'components/Menus/MenuButton';
import Avatar from '@material-ui/core/Avatar';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { withUserProfile } from 'Modules/UserProfile';
import withSelf from '../../../App/hocs/withSelf';

const AvatarStyle = styled(Avatar)`
  height: 34px !important;
  width: 34px !important;
`;

const Img = styled.img`
  height: 34px;
  width: 34px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.active};
`;

const UserMenu = ({ self, userProfile, onLogout }) => {
  const name = self.properties.firstName === self.properties.lastName
    ? self.properties.firstName
    : `${self.properties.firstName} ${self.properties.lastName}`;

  const avatarInits =
    self.properties && self.properties.firstName && self.properties.lastName
      ? `${self.properties.firstName.substring(0, 1)
        .toUpperCase()}${self.properties.lastName.substring(0, 1).toUpperCase()}`
      : self.name.substring(0, 1).toUpperCase();

  const avatarComponent = userProfile.properties.avatar
    ? <Img src={userProfile.properties.avatar} alt={name} />
    : avatarInits;

  return (
    <MenuButton
      id="main--user--menu"
      icon={<AvatarStyle>{avatarComponent}</AvatarStyle>}
    >
      <ListItem dense button component={Link} to={`/${self.properties.gestalt_home.properties.fqon}/users/${self.id}`}>
        <AvatarStyle>{avatarComponent}</AvatarStyle>
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

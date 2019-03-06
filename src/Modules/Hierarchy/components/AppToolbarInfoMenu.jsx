import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuButton from 'components/Menus/MenuButton';
import { A } from 'components/Links';
import { GalacticFogIcon } from 'components/Icons';
import { LicenseModal } from 'Modules/Licensing';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import UpgradeIcon from '@material-ui/icons/PresentToAll';
import DocIcon from '@material-ui/icons/LibraryBooks';
import LicenseIcon from '@material-ui/icons/VpnKey';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { UI_VERSION, DOCUMENTATION_URL, APP_TITLE } from '../../../constants';

const InfoMenu = () => {
  const { showModal } = useContext(ModalContext);

  return (
    <MenuButton
      id="main--info--menu"
      icon={<InfoIcon fontSize="small" />}
    >
      <ListItem>
        <GalacticFogIcon size={36} fill="#222639" />
        <ListItemText primary={APP_TITLE} secondary={`ui v${UI_VERSION}`} />
      </ListItem>
      <Divider />
      <ListItem dense button component={Link} to="/upgrade">
        <UpgradeIcon fontSize="small" color="action" />
        <ListItemText primary="Upgrade" />
      </ListItem>
      <ListItem dense button onClick={() => showModal(LicenseModal)}>
        <LicenseIcon fontSize="small" color="action" />
        <ListItemText primary="Licensing" />
      </ListItem>
      <ListItem dense button component={A} href={DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
        <DocIcon fontSize="small" color="action" />
        <ListItemText primary="Documentation" />
      </ListItem>
    </MenuButton>
  );
};

export default InfoMenu;

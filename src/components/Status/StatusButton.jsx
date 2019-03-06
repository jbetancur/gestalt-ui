import React from 'react';
import PropTypes from 'prop-types';
import MenuButton from 'components/Menus/MenuButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import statusMap from './statusMap';

const StatusButton = ({ children, status, asButton, ...rest }) => {
  const backgroundColor = asButton ? statusMap(status).color : null;

  const icon = asButton
    ? <ExpandMoreIcon fontSize="small" color="action" />
    : <MoreVertIcon fontSize="small" color="primary" />;

  return (
    <MenuButton
      {...rest}
      id="container-actions-menu"
      icon={icon}
      iconAfter
      flat={asButton}
      flatVariant="outlined"
      flatColor={backgroundColor}
      label={status}
      disabled={!status}
    >
      {children}
    </MenuButton>
  );
};

StatusButton.propTypes = {
  children: PropTypes.any,
  status: PropTypes.string,
  asButton: PropTypes.bool,
};

StatusButton.defaultProps = {
  children: null,
  status: 'PENDING',
  asButton: false,
};

export default StatusButton;

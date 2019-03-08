import React from 'react';
import PropTypes from 'prop-types';
// import { DeleteIcon } from 'components/Icons';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from './IconButton';

const DeleteIconButton = ({ icon, ...rest }) => (
  <IconButton
    icon={icon}
    {...rest}
  />);

DeleteIconButton.propTypes = {
  icon: PropTypes.any,
};

DeleteIconButton.defaultProps = {
  icon: <DeleteIcon fontSize="small" color="error" />,
};

export default DeleteIconButton;

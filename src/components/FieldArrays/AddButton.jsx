import React from 'react';
import PropTypes from 'prop-types';
import { FlatButton } from 'components/Buttons';
import AddIcon from '@material-ui/icons/Add';

const AddButton = ({ onClick, label }) => (
  <FlatButton
    onClick={onClick}
    label={label}
    icon={<AddIcon />}
    disableRipple
    color="primary"
  />
);

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

AddButton.defaultProps = {
  label: null,
};

export default AddButton;

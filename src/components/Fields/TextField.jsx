import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
// import Tooltip from '@material-ui/core/Tooltip';

/* eslint-disable react/prop-types */
const TextFieldWrapper = ({ input, helpText, variant, margin, fullWidth, ...rest }) => (
  <TextField
    {...input}
    {...rest}
    helperText={helpText}
    margin={margin}
    variant={variant}
    fullWidth={fullWidth}
  />
);

TextFieldWrapper.propTypes = {
  variant: PropTypes.string,
  margin: PropTypes.string,
  fullWidth: PropTypes.bool,
};

TextFieldWrapper.defaultProps = {
  variant: 'outlined',
  margin: 'dense',
  fullWidth: false,
};


export default TextFieldWrapper;

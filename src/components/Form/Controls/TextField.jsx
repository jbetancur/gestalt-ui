import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

const ToolTipIcon = styled(InfoOutlineIcon)`
  margin-top: 1px;
  font-size: 16px !important;
`;

/* eslint-disable react/prop-types */
const TextFieldWrapper = ({ input: { name, value, ...restInput }, meta, disableError, helpText, margin, variant, toolTip, ...rest }) => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;
  const showHelperText = !disableError && showError;

  return (
    <TextField
      {...restInput}
      {...rest}
      name={name}
      helperText={showHelperText ? meta.error || meta.submitError : helpText}
      error={showError}
      value={value}
      margin={margin}
      variant={variant}
      InputProps={toolTip ? {
        startAdornment: (
          <InputAdornment position="start">
            <Tooltip title={toolTip}>
              <ToolTipIcon fontSize="small" color="action" />
            </Tooltip>
          </InputAdornment>
        ),
      } : null}
      fullWidth
    />
  );
};

TextFieldWrapper.propTypes = {
  variant: PropTypes.string,
  margin: PropTypes.string,
  disableError: PropTypes.bool,
};

TextFieldWrapper.defaultProps = {
  variant: 'outlined',
  margin: 'dense',
  disableError: false,
};


export default TextFieldWrapper;

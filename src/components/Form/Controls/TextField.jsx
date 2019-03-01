import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

const ToolTipIcon = styled(FontIcon)`
  font-size: 16px !important;
`;

/* eslint-disable react/prop-types */
const TextFieldWrapper = ({ input: { name, value, ...restInput }, meta, helpText, margin, variant, toolTip, ...rest }) => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

  return (
    <TextField
      {...restInput}
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : helpText}
      error={showError}
      value={value}
      margin={margin}
      variant={variant}
      InputProps={toolTip ? {
        startAdornment: (
          <InputAdornment position="start">
            <Tooltip title={toolTip}>
              <ToolTipIcon>info_outline</ToolTipIcon>
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
};

TextFieldWrapper.defaultProps = {
  variant: 'outlined',
  margin: 'dense',
};


export default TextFieldWrapper;

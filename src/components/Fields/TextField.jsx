import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const TextFieldStyle = styled(({ xsmall, ...rest }) => <TextField {...rest} />)`
  ${props => props.xsmall && css`
    input {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  `};
`;

/* eslint-disable react/prop-types */
const TextFieldWrapper = ({ input, helpText, variant, margin, fullWidth, xsmall, ...rest }) => (
  <TextFieldStyle
    {...input}
    {...rest}
    helperText={helpText}
    margin={margin}
    variant={variant}
    fullWidth={fullWidth}
    xsmall={xsmall}
  />
);

TextFieldWrapper.propTypes = {
  variant: PropTypes.string,
  margin: PropTypes.string,
  fullWidth: PropTypes.bool,
  xsmall: PropTypes.bool,
};

TextFieldWrapper.defaultProps = {
  variant: 'outlined',
  margin: 'dense',
  fullWidth: false,
  xsmall: false,
};


export default TextFieldWrapper;

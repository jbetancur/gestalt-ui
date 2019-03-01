import * as React from 'react';
import styled, { css } from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

const FormGroupWrapper = styled(FormGroup)`
  ${props => props.fullWidth && css`
    flex: 1;
    margin-left: 14px;
  `};
`;

/* eslint-disable react/prop-types */
const CheckboxWrapper = ({
  input: { ...restIput },
  meta,
  label,
  disabled,
  fullWidth,
  value,
  ...rest
}) => (
  <FormGroupWrapper fullWidth={fullWidth}>
    <FormControlLabel
      disabled={disabled}
      control={(
        <Checkbox
          {...restIput}
          {...rest}
          value={value}
        />
      )}
      label={label}
    />
  </FormGroupWrapper>
);

export default CheckboxWrapper;

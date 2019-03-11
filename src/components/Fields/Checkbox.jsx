import React from 'react';
import styled, { css } from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const FormGroupWrapper = styled(({ fullWidth, ...rest }) => <FormGroup {...rest} />)`
  ${props => props.fullWidth && css`
    flex: 1;
    margin-left: 14px;
  `};
`;

/* eslint-disable react/prop-types */
const CheckboxWrapper = ({
  input: { ...restIput },
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
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          indeterminateIcon={<IndeterminateCheckBoxIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          value={value}
        />
      )}
      label={label}
    />
  </FormGroupWrapper>
);

export default CheckboxWrapper;

import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/* eslint-disable react/prop-types */
const CheckboxWrapper = ({
  input: { ...restIput },
  meta,
  label,
  disabled,
  value,
  ...rest
}) => (
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
);

export default CheckboxWrapper;

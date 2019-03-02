import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

/* eslint-disable react/prop-types */
const CheckboxWrapper = ({
  input: { ...restIput },
  meta,
  label,
  disabled,
  value,
  ...rest
}) => (
  <FormControl margin="dense">
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
  </FormControl>
);

export default CheckboxWrapper;

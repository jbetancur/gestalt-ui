import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

/* eslint-disable react/prop-types */
const CheckboxWrapper = ({
  input: { ...restIput },
  meta,
  label,
  disabled,
  value,
  helpText,
  ...rest
}) => (
  <FormControl margin="dense">
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
    {helpText && (
      <FormHelperText>{helpText}</FormHelperText>
    )}
  </FormControl>
);

export default CheckboxWrapper;

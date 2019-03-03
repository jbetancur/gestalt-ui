import React, { forwardRef } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

/* eslint-disable react/prop-types */
const CheckboxWrapper = forwardRef((props, ref) => (
  <Checkbox
    {...props}
    inputRef={ref}
    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
    indeterminateIcon={<IndeterminateCheckBoxIcon fontSize="small" />}
    checkedIcon={<CheckBoxIcon fontSize="small" />}
    style={{ padding: '10px' }}
  />
));

export default CheckboxWrapper;

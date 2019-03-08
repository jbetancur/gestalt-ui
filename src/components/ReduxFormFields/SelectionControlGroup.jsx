import React from 'react';
import { SelectionControlGroup } from 'react-md';
import CheckedIcon from '@material-ui/icons/CheckBox';
import UnCheckedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import RadioCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import UnCheckedRadioIcon from '@material-ui/icons/RadioButtonUnchecked';

/* eslint-disable react/prop-types */
export default ({ input, ...others }) => (
  <SelectionControlGroup
    checkedRadioIcon={<RadioCheckedIcon fontSize="small" />}
    uncheckedRadioIcon={<UnCheckedRadioIcon fontSize="small" />}
    checkedCheckboxIcon={<CheckedIcon fontSize="small" />}
    uncheckedCheckboxIcon={<UnCheckedIcon fontSize="small" />}
    id={input.name}
    style={{ margin: 0, padding: 0 }}
    {...input}
    {...others}
  />
);

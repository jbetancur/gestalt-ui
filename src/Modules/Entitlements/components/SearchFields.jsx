import React from 'react';
import PropTypes from 'prop-types';
import { SelectionControlGroup } from 'react-md';
import CheckedIcon from '@material-ui/icons/CheckBox';
import UnCheckedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import RadioCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import UnCheckedRadioIcon from '@material-ui/icons/RadioButtonUnchecked';

const SearchFields = props => (
  <SelectionControlGroup
    id="selection-control-group-fields"
    name="radio-fields"
    type="radio"
    inline
    onChange={props.onChange}
    defaultValue="groups"
    checkedRadioIcon={<RadioCheckedIcon fontSize="small" />}
    uncheckedRadioIcon={<UnCheckedRadioIcon fontSize="small" />}
    checkedCheckboxIcon={<CheckedIcon fontSize="small" />}
    uncheckedCheckboxIcon={<UnCheckedIcon fontSize="small" />}
    controls={[{
      label: 'Group',
      value: 'groups',
    },
    {
      label: 'User',
      value: 'users',
    }]}
  />
);

SearchFields.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SearchFields;

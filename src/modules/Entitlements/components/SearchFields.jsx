import React from 'react';
import PropTypes from 'prop-types';
import SelectionControlGroup from 'react-md/lib/SelectionControls/SelectionControlGroup';

const SearchFields = props => (
  <SelectionControlGroup
    id="selection-control-group-fields"
    name="radio-fields"
    type="radio"
    inline
    onChange={props.onChange}
    defaultValue="groups"
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

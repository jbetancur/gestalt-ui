import React from 'react';
import PropTypes from 'prop-types';
import RadioGroup from 'components/Fields/RadioGroup';

const SearchFields = props => (
  <RadioGroup
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

import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

const EntitlementCheckBox = (props) => {
  const handleCheck = () => props.onChange(props.model);

  return (
    <Checkbox
      {...props}
      onChange={handleCheck}
    />
  );
};

EntitlementCheckBox.propTypes = {
  model: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EntitlementCheckBox;

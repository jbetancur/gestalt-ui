import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-md';

const EntitlementCheckBox = memo(({ onChange, model, ...rest }) => (
  <Checkbox
    {...rest}
    inkDisabled
    onChange={() => onChange(model)}
  />
));

EntitlementCheckBox.propTypes = {
  model: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EntitlementCheckBox;

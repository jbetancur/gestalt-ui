import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Checkbox from 'components/Fields/Checkbox';

const CheckBoxStyle = styled(Checkbox)`
  height: 24px;
  width: 24px;
`;

const EntitlementCheckBox = memo(({ onChange, model, ...rest }) => (
  <CheckBoxStyle
    {...rest}
    disableRipple
    onChange={() => onChange(model)}
  />
));

EntitlementCheckBox.propTypes = {
  model: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EntitlementCheckBox;

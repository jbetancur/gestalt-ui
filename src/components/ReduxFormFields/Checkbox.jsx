import React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'react-md';

const CheckboxStyle = styled(Checkbox)`
  ${props => props.hasMargin && ' margin-top: 19px'};
`;

/* eslint-disable react/prop-types */
const CheckboxFormControl = ({ input, hasMargin, ...others }) => (
  <CheckboxStyle id={input.name} {...input} hasMargin={hasMargin} {...others} />
);

CheckboxFormControl.defaultProps = {
  hasMargin: true,
};

export default CheckboxFormControl;

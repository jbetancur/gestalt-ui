import React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'react-md';

const CheckboxStyle = styled(Checkbox)`
    margin-top: 19px;
`;

/* eslint-disable react/prop-types */
export default ({ input, ...others }) => (
  <CheckboxStyle id={input.name} {...input} {...others} />
);

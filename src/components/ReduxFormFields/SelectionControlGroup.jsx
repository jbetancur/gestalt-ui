import React from 'react';
import { SelectionControlGroup } from 'react-md';

/* eslint-disable react/prop-types */
export default ({ input, ...others }) => (
  <SelectionControlGroup
    id={input.name}
    style={{ margin: 0, padding: 0 }}
    {...input}
    {...others}
  />
);

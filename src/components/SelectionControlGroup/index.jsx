import React from 'react';
import { SelectionControlGroup } from 'react-md/lib/SelectionControls';

/* eslint-disable react/prop-types */
export default ({ input, meta: { touched, error }, ...others }) => (
  <SelectionControlGroup
    id={input.name}
    {...input}
    {...others}
    error={touched && !!error}
  />
);

import React from 'react';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

/* eslint-disable react/prop-types */
export default ({ input, meta: { touched, error }, ...others }) => (
  <Checkbox {...input} {...others} error={touched && !!error} errorText={error} />
);

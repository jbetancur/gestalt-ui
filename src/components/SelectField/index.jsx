import React from 'react';
import SelectField from 'react-md/lib/SelectFields';

/* eslint-disable react/prop-types */
export default ({ input, meta: { touched, error }, ...others }) => (
  <SelectField id={input.name} {...input} {...others} error={touched && !!error} errorText={error} />
);

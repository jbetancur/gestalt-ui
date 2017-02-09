import React from 'react';
import TextField from 'react-md/lib/TextFields';

/* eslint-disable react/prop-types */
export default ({ input, meta: { touched, error }, ...others }) => (
  <TextField id={input.name} {...input} {...others} error={touched && !!error} errorText={error} />
);

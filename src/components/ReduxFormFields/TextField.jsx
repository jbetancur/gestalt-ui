import React from 'react';
import { TextField } from 'react-md';

/* eslint-disable react/prop-types */
const InputField = ({ input, meta: { touched, error }, ...others }) => (
  <TextField
    id={input.name}
    error={touched && !!error}
    errorText={error}
    {...input}
    {...others}
  />
);

InputField.defaultProps = {
  lineDirection: 'center',
  fullWidth: true,
};

export default InputField;

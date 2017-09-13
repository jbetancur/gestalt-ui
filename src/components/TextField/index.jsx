import React from 'react';
import TextField from 'react-md/lib/TextFields';

/* eslint-disable react/prop-types */
export default (props) => {
  const { input, meta: { touched, error }, ...others } = props;

  return (
    <TextField
      id={input.name}
      {...input}
      {...others}
      error={touched && !!error}
      errorText={error}
      lineDirection="center"
      fullWidth
    />
  );
};

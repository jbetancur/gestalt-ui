import React from 'react';
import TextField from '@material-ui/core/TextField';

/* eslint-disable react/prop-types */
const TextFieldWrapper = ({ input: { name, onChange, value }, meta, ...rest }) => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;
  return (
    <TextField
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      // inputProps={restInput}
      onChange={onChange}
      value={value}
      margin="none"
      fullWidth
    />
  );
};

export default TextFieldWrapper;

import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FontIcon from 'react-md/lib/FontIcons';
import TextField from '@material-ui/core/TextField';

const CustomTextField = ({ input, input: { name, value, ...restInput }, meta, disableError, ...rest }) => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;
  const showHelperText = !disableError && showError;
  const [values, setValues] = React.useState({
    text: '',
    showPassword: false,
  });

  const handleChange = prop => (e) => {
    setValues({ ...values, [prop]: e.target.value });
    input.onChange(e);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  return (
    <TextField
      {...restInput}
      {...rest}
      name={name}
      type={values.showPassword ? 'text' : 'password'}
      value={values.text}
      helperText={showHelperText ? meta.error || meta.submitError : undefined}
      error={showError}
      onChange={handleChange('text')}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="Toggle password visibility" onClick={handleClickShowPassword}>
              {values.showPassword ? <FontIcon>visibility</FontIcon> : <FontIcon>visibility_off</FontIcon>}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

CustomTextField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  variant: PropTypes.string,
  margin: PropTypes.string,
  disableError: PropTypes.bool,
};

CustomTextField.defaultProps = {
  variant: 'outlined',
  margin: 'dense',
  disableError: false,
};

export default CustomTextField;

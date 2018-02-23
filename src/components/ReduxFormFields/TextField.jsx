import React, { PureComponent } from 'react';
import { TextField } from 'react-md';

// TODO: fixes issue where cursor jumps when maxLength is used on an input text together with redux-form

/* eslint-disable react/prop-types */
class InputField extends PureComponent {
  static defaultProps = {
    lineDirection: 'center',
    fullWidth: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.input.value,
    };
  }

  handleInputChange = (dummy, event) => {
    const { input: { onChange } } = this.props;

    this.setState({
      value: event.target.value
    });

    if (onChange) {
      onChange(event);
    }
  }

  render() {
    const { input: { value, onChange, ...input }, meta: { touched, error }, ...others } = this.props;

    return (
      <TextField
        id={input.name}
        error={touched && !!error}
        errorText={error}
        onChange={this.handleInputChange}
        value={this.state.value}
        {...input}
        {...others}
      />
    );
  }
}

export default InputField;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
  input: {
    display: 'flex',
    padding: '5px',
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  paper: {
    position: 'absolute',
    zIndex: 2,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
});

/* eslint-disable react/prop-types */
function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}
/* eslint-enable react/prop-types */

const components = {
  Control,
  Menu,
  Option,
};

class IntegrationReactSelect extends Component {
  state = {
    value: this.props.defaultValue,
  };

  handleChange = (value, action) => {
    const { onSelected } = this.props;

    if (value) {
      onSelected(value, action);
    }

    this.setState({
      value,
    });
  };

  handleInputChange = (value, action) => {
    const { onInputChange } = this.props;

    onInputChange(value, action);
  }

  render() {
    const { theme, classes, label, data, dataLabel, dataValue, onMenuOpen, isLoading, helpText, ...rest } = this.props;

    const customStyles = {
      container: base => ({ ...base, marginTop: '9px' }),
      menuPortal: base => ({ ...base, zIndex: 9999 }),
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    const mappedData = data.map(datum => ({
      value: datum[dataValue] || datum,
      label: datum[dataLabel] || datum,
    }));

    return (
      <React.Fragment>
        <Select
          {...rest}
          styles={customStyles}
          classes={classes}
          options={mappedData}
          components={components}
          value={this.state.value}
          onChange={this.handleChange}
          onMenuOpen={onMenuOpen}
          onInputChange={this.handleInputChange}
          placeholder={label}
          isLoading={isLoading}
          // noOptionsMessage="No Results found"
          isClearable
        />
        {helpText && (
          <FormHelperText style={{ marginLeft: '8px' }}>{helpText}</FormHelperText>
        )}
      </React.Fragment>
    );
  }
}

IntegrationReactSelect.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  data: PropTypes.array.isRequired,
  dataLabel: PropTypes.string,
  dataValue: PropTypes.string,
  defaultValue: PropTypes.array,
  onMenuOpen: PropTypes.func,
  onSelected: PropTypes.func,
  onInputChange: PropTypes.func,
  isLoading: PropTypes.bool,
  helpText: PropTypes.string,
};

IntegrationReactSelect.defaultProps = {
  label: 'Select...',
  dataLabel: null,
  dataValue: null,
  defaultValue: [],
  onMenuOpen: () => {},
  onSelected: () => { },
  onInputChange: () => {},
  isLoading: false,
  helpText: null,
};

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);

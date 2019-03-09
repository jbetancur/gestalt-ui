import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'components/Fields/AutoComplete';
import { Error } from 'components/Typography';

class Chips extends Component {
  static propTypes = {
    meta: PropTypes.object.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    data: PropTypes.array,
    helpText: PropTypes.string,
    dataValue: PropTypes.string,
    dataLabel: PropTypes.string,
  };

  static defaultProps = {
    input: {},
    label: 'Entry',
    data: [],
    helpText: null,
    dataValue: null,
    dataLabel: null,
  };

  state = { touched: false };

  mapDefaults(values) {
    const { dataValue, dataLabel } = this.props;

    if (Array.isArray(values)) {
      return values.map(datum => ({
        value: datum[dataValue] || datum,
        label: datum[dataLabel] || datum,
      }));
    }

    return [];
  }

  mapValues(values) {
    const { dataValue, dataLabel } = this.props;

    // if no dat key value/label are provider jist return an array of string
    if (!dataValue || !dataLabel) {
      return values.map(datum => datum.value);
    }

    return values.map(datum => ({
      value: datum[dataValue],
      label: datum[dataLabel],
    }));
  }

  addItem = (values) => {
    this.props.input.onChange(this.mapValues(values));
  }

  removeItem = (values) => {
    this.props.input.onChange(values);
  }

  handleTouched = () => {
    this.setState({ touched: true });
  }

  render() {
    const { label, data, helpText, input, meta: { error }, ...rest } = this.props;

    return (
      <React.Fragment>
        <AutoComplete
          {...rest}
          id={`${label}-chips`}
          data={data}
          label={this.props.label}
          onSelected={this.addItem}
          onFocus={this.handleTouched}
          noOptionsMessage={() => 'no results found'}
          helpText={helpText}
          isMulti
          defaultValue={this.mapDefaults(input.value)}
          menuPlacement="auto"
          menuPortalTarget={document.body}
        />
        {(this.state.touched && !!error) && <Error>{error}</Error>}
      </React.Fragment>
    );
  }
}

export default Chips;

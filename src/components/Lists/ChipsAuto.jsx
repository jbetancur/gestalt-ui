import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Autocomplete } from 'react-md';
import { Error } from 'components/Typography';
import { insertItem, removeItem } from 'util/helpers/lists';
import Chip from './Chip';

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class Chips extends Component {
  static propTypes = {
    meta: PropTypes.object.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    data: PropTypes.array,
  };

  static defaultProps = {
    input: {},
    label: 'Entry',
    data: [],
  };

  state = { touched: false };

  addItem = (value) => {
    const isDupe = this.props.input.value && this.props.input.value.find(item => item === value);

    if (value && !isDupe) {
      this.props.input.onChange(insertItem(this.props.input.value, value));
    }
  }

  removeItem = (value) => {
    this.props.input.onChange(removeItem(this.props.input.value, value));
  }

  handleTouched = () => {
    this.setState({ touched: true });
  }

  render() {
    const { label, data, input, meta: { error } } = this.props;

    return (
      <React.Fragment>
        <Autocomplete
          id={`${label}-chips`}
          placeholder={this.props.label}
          fullWidth
          onAutocomplete={this.addItem}
          lineDirection="center"
          onFocus={this.handleTouched}
          filter={Autocomplete.caseInsensitiveFilter}
          data={data}
          clearOnAutocomplete
          focusInputOnAutocomplete
          listInline
        />
        <List maxHeight="184px">
          {Array.isArray(input.value) && input.value.map((item, i) => <Chip key={`${item}--${i}`} item={item} onRemove={this.removeItem} />)}
        </List>
        {(this.state.touched && !!error) && <Error>{error}</Error>}
      </React.Fragment>
    );
  }
}

export default Chips;

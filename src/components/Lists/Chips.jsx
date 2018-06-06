import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField } from 'react-md';
import { Error } from 'components/Typography';
import { insertItem, removeItem } from 'util/helpers/lists';
import Chip from './components/Chip';

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class Chips extends Component {
  static propTypes = {
    meta: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    input: PropTypes.object,
    ignorePrefixValidation: PropTypes.bool,
    label: PropTypes.string,
  };

  static defaultProps = {
    input: {},
    prefix: null,
    ignorePrefixValidation: false,
    label: 'Entry',
  };

  state = { item: '', touched: false };

  addItem = () => {
    let prefixedItem;

    if (this.props.prefix) {
      prefixedItem = `${this.props.prefix}.${this.state.item}`;
    } else {
      prefixedItem = this.state.item;
    }

    const isDupe = this.props.input.value && this.props.input.value.find(item => item === prefixedItem);

    if (this.state.item && !isDupe) {
      this.props.input.onChange(insertItem(this.props.input.value, prefixedItem));
      this.setState({ item: '' });
    }
  }

  removeItem = (value) => {
    this.props.input.onChange(removeItem(this.props.input.value, value));
  }

  handleChange = (value) => {
    this.setState({ item: value.toLowerCase().trim() });
  }

  handleTouched = () => {
    this.setState({ touched: true });
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addItem();
    }
  }

  render() {
    const { label, input, meta: { error } } = this.props;

    return (
      <React.Fragment>
        <TextField
          id={`${label}-list-table`}
          placeholder={this.props.label}
          type="text"
          fullWidth
          onChange={this.handleChange}
          value={this.state.item}
          lineDirection="center"
          disabled={!this.props.prefix && !this.props.ignorePrefixValidation}
          onFocus={this.handleTouched}
          onBlur={this.addItem}
          onKeyDown={this.handleEnter}
          helpText="press ENTER to add a new entry"
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

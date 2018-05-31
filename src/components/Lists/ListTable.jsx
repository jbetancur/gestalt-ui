import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
} from 'react-md';
import { Error } from 'components/Typography';
import { insertItem, removeItem } from 'util/helpers/lists';
import List from './components/List';
import ListItem from './components/ListItem';

class ListTable extends PureComponent {
  static propTypes = {
    meta: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    input: PropTypes.object,
    ignorePrefixValidation: PropTypes.bool,
    label: PropTypes.string,
    addLabel: PropTypes.string,
    helpText: PropTypes.string,
  };

  static defaultProps = {
    input: {},
    prefix: null,
    ignorePrefixValidation: false,
    label: 'Action',
    addLabel: 'Add',
    helpText: null,
  };

  state = { items: [], item: '', touched: false, };

  componentWillMount() {
    if (this.props.input.value) {
      this.setState({ items: this.props.input.value });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.input.onChange && nextState.items !== this.state.items) {
      nextProps.input.onChange(nextState.items);
    }
  }

  addItem = () => {
    let prefixedItem;

    if (this.props.prefix) {
      prefixedItem = `${this.props.prefix}.${this.state.item}`;
    } else {
      prefixedItem = this.state.item;
    }

    const isDupe = this.state.items.find(item => item === prefixedItem);

    if (this.state.item && !isDupe) {
      this.setState({ items: insertItem(this.state.items, prefixedItem), item: '' });
    }
  }

  removeItem = (value) => {
    this.setState({ items: removeItem(this.state.items, value) });
  }

  handleChange = (value) => {
    this.setState({ item: value.toLowerCase().trim() });
  }

  handleTouched = () => {
    this.setState({ touched: true });
  }

  render() {
    const { label, meta: { error } } = this.props;

    return (
      <React.Fragment>
        <TextField
          id={`${label}-list-table`}
          placeholder={this.props.label}
          type="text"
          rightIcon={<Button style={{ marginTop: 0, marginBottom: 0 }} flat primary onClick={this.addItem}>{this.props.addLabel}</Button>}
          fullWidth
          onChange={this.handleChange}
          value={this.state.item}
          lineDirection="center"
          disabled={!this.props.prefix && !this.props.ignorePrefixValidation}
          helpText={this.props.helpText}
          onFocus={this.handleTouched}
        />
        <List maxHeight="168px">
          {this.state.items.map((item, i) => <ListItem key={`${item}--${i}`} item={item} onRemove={this.removeItem} />)}
        </List>
        {(this.state.touched && !!error) && <Error>{error}</Error>}
      </React.Fragment>
    );
  }
}

export default ListTable;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
} from 'react-md';
import { insertItem, removeItem } from 'util/helpers/lists';
import List from './components/List';
import ListItem from './components/ListItem';

class ListTable extends PureComponent {
  static propTypes = {
    prefix: PropTypes.string,
    input: PropTypes.object,
  };

  static defaultProps = {
    input: {},
    prefix: null,
  };

  state = { items: [], item: '' };

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
    const prefixedItem = `${this.props.prefix}.${this.state.item}`;
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

  render() {
    return (
      <div>
        <TextField
          label="Action"
          type="text"
          rightIcon={<Button icon primary onClick={this.addItem}>add</Button>}
          fullWidth
          onChange={this.handleChange}
          value={this.state.item}
          lineDirection="center"
          disabled={!this.props.prefix}
        />
        <List>
          {this.state.items.map((item, i) => <ListItem key={`${item}--${i}`} item={item} onRemove={this.removeItem} />)}
        </List>
      </div>
    );
  }
}

export default ListTable;

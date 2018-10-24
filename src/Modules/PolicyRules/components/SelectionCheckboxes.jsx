import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Checkbox } from 'react-md';

class SelectionCheckboxes extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    selectedItems: PropTypes.array,
    onItemSelected: PropTypes.func,
  };

  static defaultProps = {
    selectedItems: [],
    onItemSelected: null,
  };

  state = {
    selectedItems: this.props.selectedItems,
  }

  handleselectedItems(action) {
    const { onItemSelected } = this.props;
    const { selectedItems } = this.state;
    const actions = selectedItems.slice();

    if (action) {
      const index = selectedItems.indexOf(action);
      if (index > -1) {
        actions.splice(index, 1);
      } else {
        actions.push(action);
      }
    }

    if (onItemSelected) {
      onItemSelected(actions);
    }

    this.setState({ selectedItems: actions });
  }

  render() {
    const { name, items } = this.props;
    const { selectedItems } = this.state;

    return (
      <Row columnDivisions={24}>
        {items.map(action => (
          <Col flex={6} xs={24} sm={12} md={12} key={action}>
            <Checkbox
              id={action}
              label={action}
              checked={!!selectedItems.find(a => a === action)}
              name={name} // this is just a stub to change form touch state and is not used in the final form values
              onChange={() => this.handleselectedItems(action)}
              style={{ margin: 0 }}
            />
          </Col>))}
      </Row>
    );
  }
}

export default SelectionCheckboxes;

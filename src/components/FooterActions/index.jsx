import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';

const Div = styled.div`
    bottom: 20px;
    position: fixed;
    right: 20px;
    z-index: 1;
`;

class CreateButton extends Component {
  static propTypes = {
    children: PropTypes.array
  };

  static defaultProps = {
    children: []
  };

  render() {
    return (
      <Div>
        {this.props.children}
      </Div>
    );
  }
}

export default CreateButton;

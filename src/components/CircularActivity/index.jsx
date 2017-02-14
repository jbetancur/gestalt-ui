import React, { Component, PropTypes } from 'react';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import styled from 'styled-components';

const Div = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

class Progress extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    return (
      <Div>
        <CircularProgress id={this.props.id} scale={3} {...this.props} />
      </Div>
    );
  }
}

export default Progress;

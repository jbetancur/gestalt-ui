import React, { Component, PropTypes } from 'react';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import styled from 'styled-components';

const Div = styled.div`
    z-index: 9999 !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
`;

class Progress extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    return (
      <Div>
        <CircularProgress id={this.props.id} scale={4} {...this.props} />
      </Div>
    );
  }
}

export default Progress;

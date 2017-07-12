import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DotActivity from 'components/DotActivity';
import styled from 'styled-components';

const Div = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;
class Progress extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    primary: PropTypes.bool,
  };

  static defaultProps = {
    primary: false,
  };

  render() {
    return (
      <Div>
        <DotActivity id={this.props.id} size={3} centered primary={this.props.primary} />
      </Div>
    );
  }
}

export default Progress;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HelpContainer = styled.div`
  color: rgba(0, 0, 0, 0.38);
  display: flex;
  font-size: ${props => props.fontSize};
  justify-content: space-between;
`;

export default class HelpText extends PureComponent {
  static propTypes = {
    message: PropTypes.string,
    fontSize: PropTypes.string,
  };

  static defaultProps = {
    message: '',
    fontSize: '12px',
  };

  render() {
    return (
      <HelpContainer>
        <span className="md-text-field-message" fontSize={this.props.fontSize}>{this.props.message}</span>
      </HelpContainer>
    );
  }
}

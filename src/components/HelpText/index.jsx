import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HelpContainer = styled.div`
  color: rgba(0, 0, 0, 0.38);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
`;

export default class HelpText extends PureComponent {
  static propTypes = {
    message: PropTypes.string,
  };

  static defaultProps = {
    message: '',
  };

  render() {
    return (
      <HelpContainer>
        <span className="md-text-field-message">{this.props.message}</span>
      </HelpContainer>
    );
  }
}

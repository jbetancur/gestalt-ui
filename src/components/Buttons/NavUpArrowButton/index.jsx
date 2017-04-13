import React from 'react';
import styled from 'styled-components';
import Button from 'react-md/lib/Buttons/Button';

const EnhancedButton = styled(Button)`
  @media (min-width: 0) and (max-width: 599px) {
    display: none;
  }
`;

const NavUpArrowButton = props =>
  <EnhancedButton icon tooltipLabel="up one level" tooltipPosition="bottom" {...props}>arrow_upward</EnhancedButton>;

export default NavUpArrowButton;

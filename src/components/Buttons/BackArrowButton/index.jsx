import React from 'react';
import styled from 'styled-components';
import Button from 'react-md/lib/Buttons/Button';

const EnhancedButton = styled(Button)`
  @media (min-width: 0) and (max-width: 599px) {
    display: none;
  }
`;

const BackArrowButton = props => <EnhancedButton icon {...props}>arrow_back</EnhancedButton>;

export default BackArrowButton;

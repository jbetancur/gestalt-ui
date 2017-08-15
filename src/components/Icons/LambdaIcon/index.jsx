import React from 'react';
import Isvg from 'react-inlinesvg';
import styled from 'styled-components';
import iconSVG from 'assets/icons/lambda.svg';

const EnhancedIcon = styled(Isvg)`
  vertical-align: top;
  padding: 0 !important;

  svg {
    height: 23px;
    width: 18px;
  }
`;

const LambdaIcon = () => (
  <EnhancedIcon className="md-icon" src={iconSVG} />
);

export default LambdaIcon;

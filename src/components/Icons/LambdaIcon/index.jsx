import React from 'react';
import Isvg from 'react-inlinesvg';
import styled from 'styled-components';
import iconSVG from 'assets/icons/lambda.svg';

const EnhancedIcon = styled(Isvg)`
  padding: .4em;
`;

const LambdaIcon = () => (
  <EnhancedIcon src={iconSVG} />
);

export default LambdaIcon;

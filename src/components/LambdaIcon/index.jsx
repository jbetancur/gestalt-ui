import React from 'react';
import Isvg from 'react-inlinesvg';
import styled from 'styled-components';
import iconSVG from '../../assets/icons/lambda_lc.svg';

const EnhancedIcon = styled(Isvg)`
  padding: .7em;
  fill: red;
`;

const LambdaIcon = () => (
  <EnhancedIcon src={iconSVG} />
);

export default LambdaIcon;

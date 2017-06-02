import React from 'react';
import Isvg from 'react-inlinesvg';
import styled from 'styled-components';
import iconSVG from 'assets/icons/provider.svg';

const EnhancedIcon = styled(Isvg)`
  padding: .2em;
`;

const ProviderIcon = () => (
  <EnhancedIcon src={iconSVG} />
);

export default ProviderIcon;

import React from 'react';
import Isvg from 'react-inlinesvg';
import styled from 'styled-components';
import iconSVG from 'assets/icons/provider.svg';

const EnhancedIcon = styled(Isvg)`
  vertical-align: top;
  padding: 0 !important;

  svg {
    height: 23px;
    width: 18px;
  }
`;

const ProviderIcon = () => (
  <EnhancedIcon className="md-icon" src={iconSVG} />
);

export default ProviderIcon;

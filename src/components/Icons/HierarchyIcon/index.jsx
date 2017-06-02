import React from 'react';
import Isvg from 'react-inlinesvg';
import styled from 'styled-components';
import iconSVG from 'assets/icons/hierarchy.svg';

const EnhancedIcon = styled(Isvg)`
  padding: .3em;
`;

const HierarchyIcon = () => (
  <EnhancedIcon src={iconSVG} />
);

export default HierarchyIcon;

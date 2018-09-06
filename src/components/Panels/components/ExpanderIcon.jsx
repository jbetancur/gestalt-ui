import React from 'react';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';

const ExpanderIcon = styled(({ isExpanded, ...rest }) => <FontIcon {...rest} />)`
  margin-left: 3px;
  margin-right: 3px;
  transition: transform 100ms ease;
  transform: ${props => (props.isExpanded ? 'rotate(0)' : 'rotate(-90deg)')};
`;

export default withTheme(ExpanderIcon);

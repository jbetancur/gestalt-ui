import React from 'react';
import styled from 'styled-components';
import ExpandIcon from '@material-ui/icons/ChevronRight';

const ExpanderIcon = styled(({ isExpanded, ...rest }) => <ExpandIcon color="action" {...rest} />)`
  margin-left: 3px;
  margin-right: 3px;
  transition: transform 100ms ease;
  transform: ${props => (props.isExpanded ? 'rotate(90deg)' : 'rotate(0)')};
`;

export default ExpanderIcon;

import React from 'react';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';

const EnhancedButton = styled(Button)`
    margin-top: 2em;
`;

const StyledIcon = styled.i`
    color: ${props => props.theme.removeIconColor};
`;

const FieldRemoveButton = props =>
  <EnhancedButton icon {...props}><StyledIcon><FontIcon>remove_circle_outline</FontIcon></StyledIcon></EnhancedButton>;

export default FieldRemoveButton;

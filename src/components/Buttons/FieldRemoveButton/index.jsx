import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cn from 'classnames';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';

const EnhancedButton = styled(Button)`
    margin-top: 2em;

    &.in-table {
        margin-top: 0;
    }
`;

const StyledIcon = styled.i`
    color: ${props => props.theme.removeIconColor};
`;

const FieldRemoveButton = props =>
  <EnhancedButton icon {...props} className={cn({ 'in-table': props.inTable })} ><StyledIcon><FontIcon>remove_circle_outline</FontIcon></StyledIcon></EnhancedButton>;


FieldRemoveButton.propTypes = {
  inTable: PropTypes.bool,
};

FieldRemoveButton.defaultProps = {
  inTable: false,
};

export default FieldRemoveButton;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';

const EnhancedButton = styled(({ inTable, marginTop, ...rest }) => <Button {...rest} />)`
    margin-top: ${prop => prop.marginTop};
    ${props => props.inTable && 'margin-top: 0'};
`;

const StyledIcon = styled.i`
    color: ${props => props.theme.removeIconColor};
`;

const FieldRemoveButton = props => (
  <EnhancedButton
    inTable={props.inTable}
    icon
    iconChildren={
      <StyledIcon>
        <FontIcon inherit>remove_circle_outline</FontIcon>
      </StyledIcon>
    }
    marginTop={props.marginTop}
    {...props}
  />
);


FieldRemoveButton.propTypes = {
  inTable: PropTypes.bool,
  marginTop: PropTypes.string,
};

FieldRemoveButton.defaultProps = {
  inTable: false,
  marginTop: '2em',
};

export default FieldRemoveButton;

import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const Name = styled(({ maxWidth, ...rest }) => <div {...rest} />)`
  display: block;
  max-width: ${props => props.maxWidth};
  color: ${props => props.theme.colors['$md-grey-800']};
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  overflow: hidden;
`;

const Description = styled(({ maxWidth, ...rest }) => <div {...rest} />)`
  max-width: ${props => props.maxWidth};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  font-size: 12px;
  color: ${props => props.theme.colors['$md-grey-800']};
`;

const NameCell = ({ name, description, maxWidth }) => (
  <div>
    <Name maxWidth={maxWidth}>{name}</Name>
    {description &&
      <Description maxWidth={maxWidth}>
        {description}
      </Description>}
  </div>
);

NameCell.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  maxWidth: PropTypes.string,
};

NameCell.defaultProps = {
  name: null,
  description: null,
  maxWidth: '300px',
};

export default withTheme(NameCell);

import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { truncate } from 'util/helpers/strings';

const LinkName = styled(Link)`
  display: block;
  max-width: 300px;
  color: ${props => props.theme.colors['$md-blue-500']};
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Description = styled.div`
  max-width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  font-size: 12px;
  color: ${props => props.theme.colors['$md-grey-800']};
`;

const Name = ({ name, description, linkable, to }) => (
  <div>
    {linkable ? <LinkName to={to}>{name}</LinkName> : <div>{truncate(name, 25)}</div>}
    {description &&
      <Description>
        {description}
      </Description>}
  </div>
);

Name.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  linkable: PropTypes.bool,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

Name.defaultProps = {
  name: null,
  description: null,
  linkable: false,
  to: null,
};

export default withTheme(Name);

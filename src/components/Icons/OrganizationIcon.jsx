import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Domain';

const OrganizationIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const OrganizationIcon = ({ size, color, ...rest }) => <OrganizationIconStyle size={size} color={color} {...rest} />;

OrganizationIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

OrganizationIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default OrganizationIcon;

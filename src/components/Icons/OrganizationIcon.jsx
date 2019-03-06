import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Domain';

const OrganizationIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px !important`};
  color: ${props => `${props.color}`};
`;

const OrganizationIcon = ({ size, color, ...rest }) => <OrganizationIconStyle size={size} color={color} {...rest} />;

OrganizationIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

OrganizationIcon.defaultProps = {
  size: 24,
  color: 'action',
};

export default OrganizationIcon;

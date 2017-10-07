import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { GestaltIcon } from 'components/Icons';

const LogoContainerStyle = styled(Row)`
  position: absolute;
  line-height: 4.4em;
  text-align: center;
  margin: 0;
`;

const Logo = styled(Col)`
  svg {
    height: 1.8em;
    width: 1.8em;
  }
`;

const AppLogo = props => (
  props.visible &&
    <LogoContainerStyle center>
      <Logo flex ><GestaltIcon /></Logo>
    </LogoContainerStyle>
);

AppLogo.propTypes = {
  visible: PropTypes.bool,
};

AppLogo.defaultProps = {
  visible: true,
};

export default AppLogo;

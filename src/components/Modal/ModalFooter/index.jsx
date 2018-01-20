import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const WrapperDiv = styled.div`
  height: 32px;
`;

const FooterDiv = styled.div`
  position: absolute;
  right: 0;
  padding: 16px;
  bottom: 0;
`;

const ModalFooter = props => (
  <WrapperDiv>
    <FooterDiv>
      {props.children}
    </FooterDiv>
  </WrapperDiv>
);

ModalFooter.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};

ModalFooter.defaultProps = {
  children: [],
};

export default ModalFooter;

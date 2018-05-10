import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 42px;
`;

const FooterDiv = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  bottom: 0;
  height: px;

  * {
    margin: 5px;
  }
`;

const ModalFooter = ({ children }) => (
  <Wrapper>
    <FooterDiv>
      {children}
    </FooterDiv>
  </Wrapper>
);

ModalFooter.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};

ModalFooter.defaultProps = {
  children: [],
};

export default ModalFooter;

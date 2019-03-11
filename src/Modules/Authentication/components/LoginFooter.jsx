import React from 'react';
import styled from 'styled-components';
import { COMPANY_URL, COMPANY_TITLE } from '../../../constants';

const Footer = styled.footer`
  position: fixed;
  z-index: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
`;

const A = styled.a`
  font-size: 18px;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

const CompanyName = styled.span`
  font-family: lovelo, Ubuntu;
  color: ${props => props.theme.colors.loginFont};
`;

const LoginFooter = () => (
  <Footer>
    <A
      href={COMPANY_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <CompanyName>{COMPANY_TITLE}</CompanyName>
    </A>
  </Footer>
);

export default LoginFooter;

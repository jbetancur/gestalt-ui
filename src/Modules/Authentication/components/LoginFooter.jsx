import React from 'react';
import styled from 'styled-components';
import { Col, Row } from 'react-flexybox';
import { COMPANY_URL, COMPANY_TITLE } from '../../../constants';

const Wrapper = styled.div`
  position: fixed;
  z-index: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 0.9em;
`;

const A = styled.a`
  font-size: 16px;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

const CompanyName = styled.span`
  font-family: lovelo, Ubuntu;
  color: ${props => props.theme.colors['$russian-black-25']};
`;

const LoginFooter = () => (
  <Wrapper>
    <Row center>
      <Col
        className="logo"
        flex={12}
      >
        <A
          href={COMPANY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <CompanyName>{COMPANY_TITLE}</CompanyName>
        </A>
      </Col>
    </Row>
  </Wrapper>
);

export default LoginFooter;

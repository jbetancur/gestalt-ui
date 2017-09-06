import React from 'react';
import styled from 'styled-components';
import { Col, Row } from 'react-flexybox';
import { GalacticFogIcon } from 'components/Icons';
import { COMPANY_URL, COMPANY_TITLE } from '../../../../constants';

const Wrapper = styled.div`
    background-color: ${props => props.theme.colors['$gf-dull-blue']};
    position: fixed;
    z-index: 0;
    left: 0;
    bottom: 0;
    height: 3em;
    width: 100%;
    text-align: center;
    padding: .3em;
`;

const A = styled.a`
    font-size: 1.3em;
    text-decoration: none;
    color: ${props => props.theme.fontColorInverse};

    &:hover {
      cursor: pointer;
    }

    svg {
        margin-top: -.05em;
        height: 2em;
        width: 2em;
    }
`;

const CompanyName = styled.span`
  color: ${props => props.theme.fontColorInverse};
  font-family: lovelo, Ubuntu;
`;

const LoginFooter = () => (
  <Wrapper>
    <Row center>
      <Col
        component={A}
        className="logo"
        href={COMPANY_URL}
        target="_blank"
        rel="noopener noreferrer"
        flex={12}
      >
        <GalacticFogIcon /><CompanyName>{COMPANY_TITLE}</CompanyName>
      </Col>
    </Row>
  </Wrapper>
);

export default LoginFooter;

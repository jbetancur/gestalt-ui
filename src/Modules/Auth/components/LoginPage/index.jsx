import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Container, Col, Row } from 'react-flexybox';
import LoginForm from '../LoginForm';
import LoginFooter from '../LoginFooter';
import lightTheme from '../../../../themes/light';

const Wrapper = styled(Container)`
  padding-bottom: 4em;
  background-color: ${props => props.theme.colors['$gf-bright-blue']};
  height: 100%;

  form {
      height: 100%;
  }
`;

const CardWrapper = styled.div`
  box-shadow: 0 16px 30px -12px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12), 0 8px 10px -5px rgba(0,0,0,.4);
  border-radius: 11%;
`;

const LoginPage = props => (
  <ThemeProvider theme={lightTheme}>
    <Wrapper fluid>
      <Row center fill>
        <Col flex={4} xs={12} sm={7} md={5}>
          <CardWrapper>
            <LoginForm {...props} />
          </CardWrapper>
        </Col>
      </Row>
      <LoginFooter />
    </Wrapper>
  </ThemeProvider>
);

export default LoginPage;


import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import LoginForm from '../LoginForm';
import LoginFooter from '../LoginFooter';
import lightTheme from '../../../../style/themes/light';

const Wrapper = styled.div`
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
    <Wrapper className="flex-row">
      <div className="flex-12 flex-row center-center">
        <CardWrapper className="flex-4 flex-xs-12 flex-sm-6">
          <LoginForm {...props} />
        </CardWrapper>
      </div>
      <LoginFooter />
    </Wrapper>
  </ThemeProvider>
);

export default LoginPage;


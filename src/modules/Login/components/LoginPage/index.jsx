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

const LoginPage = props => (
  <ThemeProvider theme={lightTheme}>
    <Wrapper className="flex-row">
      <div className="flex-12 flex-row center-center">
        <div className="flex-4 flex-xs-12 flex-sm-6 flex-md-5 md-paper md-paper--5">
          <LoginForm {...props} />
        </div>
      </div>
      <LoginFooter />
    </Wrapper>
  </ThemeProvider>
);

export default LoginPage;


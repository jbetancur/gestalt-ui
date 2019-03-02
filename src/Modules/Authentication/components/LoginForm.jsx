import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import { TextField, PasswordTextField } from 'components/Form';
import { DotActivity } from 'components/ProgressIndicators';
import LoginStyle from './LoginStyle';
import LoginButton from './LoginButton';

const Username = styled(TextField)`
  ${LoginStyle};
`;

const Password = styled(PasswordTextField)`
  ${LoginStyle};
`;

const LoginCardText = styled.div`
  padding: 18px;

  input {
    font-size: 16px;
  }
`;

const LoginForm = ({ submitting, handleSubmit, pending }) => (
  <form onSubmit={handleSubmit}>
    <LoginCardText>
      <Field
        id="login--username"
        component={Username}
        name="username"
        placeholder="Username"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        margin="normal"
        variant="filled"
      />
      <Field
        id="login--password"
        component={Password}
        name="password"
        placeholder="Password"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        margin="normal"
        variant="filled"
      />
    </LoginCardText>

    <LoginCardText>
      <Row justifyContent="center">
        <Col flex={12}>
          <LoginButton
            id="login--submit"
            raised
            primary
            type="submit"
            disabled={pending || submitting}
          >
            {pending ? <DotActivity id="login-form" primary centered size={1.2} /> : 'Login'}
          </LoginButton>
        </Col>
      </Row>
    </LoginCardText>
  </form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pending: PropTypes.bool,
};

LoginForm.defaultProps = {
  pending: false,
};

export default LoginForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import { DotActivity } from 'components/ProgressIndicators';
import LoginButton from './LoginButton';
import TextField from './TextField';

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
        component={TextField}
        name="username"
        type="text"
        placeholder="Username"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        autoFocus
      />
      <Field
        id="login--password"
        component={TextField}
        name="password"
        type="password"
        placeholder="Password"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
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

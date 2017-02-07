import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from '../../../../components/TextField';
import LoginFooter from '../LoginFooter';

const Wrapper = styled.div`
  padding-bottom: 4em;
  background-color: #58acba;
  height: 100%;
  form {
      height: 100%;
  }
`;

const LoginCard = styled(Paper)`
  position: relative;
  background-color: white;
`;

const LoginCardHeader = styled(CardTitle)`
  color: white;
  font-family: lovelo, Ubuntu;
  background-color: #222933;
`;

const LoginError = styled.div`
  padding: 1em;
  width: 100%;
  color: red;
  text-align:center;
`;

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'username is required';
  }

  if (!values.password) {
    errors.password = 'password is required';
  }

  return errors;
};

const LoginForm = (props) => {
  const { login, handleSubmit, pristine, invalid, submitting, touched, error } = props;
  const submit = (values) => {
    login(values.username, values.password);
  };

  return (
    <Wrapper>
      <form className="flex-row" onSubmit={handleSubmit(submit)}>
        <div className="flex-12 flex-row center-center">
          <LoginCard className="flex-4 flex-xs-12 flex-sm-6 flex-md-5" zDepth={4}>
            <LoginCardHeader className="flex-row center-center">
              Gestalt
            </LoginCardHeader>
            <CardText>
              <Field
                component={TextField}
                name="username"
                type="text"
                errorText={touched && error}
                placeholder="Username"
                lineDirection="center"
              />
              <Field
                component={TextField}
                name="password"
                type="password"
                errorText={touched && error}
                placeholder="Password"
                lineDirection="center"
              />
              <LoginError>{props.statusText}</LoginError>
            </CardText>
            {props.isAuthenticating ? <LinearProgress id="login-form" /> : null}
            <CardActions className="flex-row">
              <Button
                className="flex-12"
                flat
                primary
                type="submit"
                label="Login"
                disabled={pristine || submitting || invalid}
              />
            </CardActions>
          </LoginCard>
        </div>
        <LoginFooter />
      </form>
    </Wrapper>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  statusText: PropTypes.string.isRequired
};

export default reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate
})(LoginForm);


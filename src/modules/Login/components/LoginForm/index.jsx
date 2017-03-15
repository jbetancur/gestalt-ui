import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import i18next from 'i18next';
import styled from 'styled-components';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from '../../../../components/TextField';
import { APP_TITLE } from '../../../../constants';

const LoginCard = styled(Paper)`
  position: relative;
  background-color: ${props => props.theme.cardBackgroundColor};
`;

const LoginCardHeader = styled(CardTitle)`
  color: ${props => props.theme.fontColorInverse};
  font-family: lovelo, Ubuntu;
  background-color: ${props => props.theme.mainNavBackgroundColor};
`;

const LoginError = styled.div`
  padding: 1em;
  width: 100%;
  color: ${props => props.theme.errorText};
  text-align:center;
`;

const validate = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = i18next.t('auth.fields.username.errorText');
  }

  if (!values.password) {
    errors.password = i18next.t('auth.fields.password.errorText');
  }

  return errors;
};

const LoginForm = (props) => {
  const { login, loginModal, handleSubmit, pristine, invalid, submitting, touched, error, t } = props;
  const submit = (values) => {
    login(values.username, values.password, loginModal.visible);
  };

  return (
    <LoginCard>
      <form onSubmit={handleSubmit(submit)}>
        <LoginCardHeader className="flex-row center-center">
          {APP_TITLE}
        </LoginCardHeader>
        <CardText>
          <Field
            component={TextField}
            name="username"
            type="text"
            errorText={touched && error}
            placeholder={t('auth.fields.username.label')}
          />
          <Field
            component={TextField}
            name="password"
            type="password"
            errorText={touched && error}
            placeholder={t('auth.fields.password.label')}
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
            label={t('auth.login')}
            disabled={pristine || submitting || invalid}
          />
        </CardActions>
      </form>
    </LoginCard>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  loginModal: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  statusText: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

LoginForm.defaultProps = {
  touched: false,
  error: false,
  statusText: '',
};

export default reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate
})(LoginForm);


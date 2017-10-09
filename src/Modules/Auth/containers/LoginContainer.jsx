import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import actions from '../actions';
import LoginPage from '../components/LoginPage';

const validate = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = ' ';
  }

  if (!values.password) {
    errors.password = ' ';
  }

  return errors;
};

class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    loginModal: PropTypes.object.isRequired,
    hideLoginModal: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  submitLogin = (values) => {
    const { history, login, loginModal, hideLoginModal } = this.props;
    // TODO: disabled for now since we need to refactor routing - but this allows us to redirect to a pasted path
    // const path = (props.router.location.state && props.router.location.state.nextPathname) || '/';
    login(values.username, values.password).then(() => {
      if (loginModal.visible) {
        hideLoginModal();
      } else {
        history.replace('/');
      }
    });
  };

  render() {
    return (
      <LoginPage
        onSubmit={this.submitLogin}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.login.login.token,
    isAuthenticating: state.login.login.isAuthenticating,
    statusText: state.login.login.statusText,
    loginModal: state.login.loginModal,
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'login',
  validate
})(LoginContainer));

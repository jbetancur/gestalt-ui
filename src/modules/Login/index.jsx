import { connect } from 'react-redux';
import * as actions from './actions';
import LoginPage from './components/LoginPage';

function mapStateToProps(state) {
  return {
    token: state.login.login.token,
    isAuthenticating: state.login.login.isAuthenticating,
    statusText: state.login.login.statusText,
    loginModal: state.login.loginModal,
  };
}

export default connect(mapStateToProps, actions)(LoginPage);

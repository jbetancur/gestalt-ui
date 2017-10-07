import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import LoginForm from '../LoginForm';
import actions from '../../actions';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 100%;
    max-width: 25em;
    .md-dialog-content {
      padding: 0;;
    }
  }
`;

class LoginModal extends PureComponent {
  static propTypes = {
    loginModal: PropTypes.object.isRequired,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <EnhancedDialog
        id="login-modal"
        visible={this.props.loginModal.visible}
        title={this.props.title}
        modal
      >
        <LoginForm {...this.props} />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginModal: state.login.loginModal,
    token: state.login.login.token,
    isAuthenticating: state.login.login.isAuthenticating,
    statusText: state.login.login.statusText,
  };
}

export default connect(mapStateToProps, actions)(LoginModal);

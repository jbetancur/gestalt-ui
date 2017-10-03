import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { withMetaResource } from 'modules/MetaResource';
import Dialog from 'react-md/lib/Dialogs';
import { ModalTitle } from 'components/Modal';
import SecretsPanelForm from '../components/SecretPanelForm';
import actions from '../actions';
// import validate from '../../components/SecretsPanelForm/validations';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 100%;
    max-width: 48em;
    .md-dialog-content {
      min-height: 10em;
      overflow: visible;
    }
  }
`;

class SecretPanelModal extends PureComponent {
  static propTypes = {
    addSecret: PropTypes.func.isRequired,
    hideSecretModal: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    secretPanelModal: PropTypes.object.isRequired,
    providerId: PropTypes.string,
    match: PropTypes.object.isRequired,
  };

  static defaultProps = {
    providerId: '',
  };

  constructor(props) {
    super(props);
  }

  addSecret(values) {
    this.props.addSecret(values);
    this.props.hideSecretModal();
    this.props.reset();
  }

  render() {
    return (
      <EnhancedDialog
        id="secret-modal"
        position="below"
        visible={this.props.secretPanelModal.visible}
        title={<ModalTitle title="Add Secret" icon="lock" />}
        modal={false}
        closeOnEsc
        autosizeContent={false}
        onHide={() => this.props.hideSecretModal()}
      >
        <SecretsPanelForm
          onSubmit={values => this.addSecret(values)}
          providerId={this.props.providerId}
          {...this.props}
        />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    secretPanelModal: state.secrets.secretPanelModal,
    initialValues: {
      mount_type: 'env',
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'secretCreate',
})(withMetaResource(withRouter(SecretPanelModal))));

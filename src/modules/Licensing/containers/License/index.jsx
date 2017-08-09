import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import ActivityContainer from 'components/ActivityContainer';
import LicenseForm from '../../components/LicenseForm';
import validate from '../../validations';
import actions from '../../actions';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 100%;
    max-width: 50em;
    min-height: 32em;

    .md-dialog-content {
      max-height: 32em;
      overflow: scroll;
    }
  }
`;

class License extends Component {
  static propTypes = {
    fetchLicense: PropTypes.func.isRequired,
    updateLicense: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    updatedLicenseInfoPending: PropTypes.bool.isRequired,
    onUnloadLicense: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    modal: PropTypes.object.isRequired,
    hideLicenseModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchLicense } = this.props;
    fetchLicense('root');
  }

  componentWillUnmount() {
    const { onUnloadLicense } = this.props;
    onUnloadLicense();
  }

  update(values) {
    const { properties } = values;
    const { updateLicense, hideLicenseModal } = this.props;
    const payload = {
      name: 'gestalt-license',
      properties: {
        data: properties.data
      }
    };

    updateLicense('root', payload).then(() => {
      hideLicenseModal();
    });
  }

  render() {
    const { pending, updatedLicenseInfoPending } = this.props;
    const isPending = pending || updatedLicenseInfoPending;

    return (
      <EnhancedDialog
        id="volume-modal"
        position="below"
        visible={this.props.modal.visible}
        title="License"
        modal={false}
        closeOnEsc
        onHide={() => this.props.hideLicenseModal()}
      >
        {isPending ?
          <ActivityContainer id="license-load" /> :
          <LicenseForm
            submitLabel="Update"
            cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
            onSubmit={values => this.update(values)}
            {...this.props}
          />}
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  const { license } = state.licensing;
  const model = {
    properties: {
      data: ''
    }
  };

  return {
    initialValues: model,
    pending: license.pending,
    licenseInfo: license.license,
    updatedLicenseInfoPending: state.licensing.licenseUpdate.pending,
    modal: state.modal,
  };
}


export default connect(mapStateToProps, actions)(reduxForm({
  form: 'licenseForm',
  validate
})(License));

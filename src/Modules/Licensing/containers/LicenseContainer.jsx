import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { DialogContainer } from 'react-md';
import { ActivityContainer } from 'components/ProgressIndicators';
import LicenseForm from './LicenseForm';
import validate from '../validations';
import actions from '../actions';

// const EnhancedDialog = styled(Dialog)`
//   .md-dialog {
//     width: 100%;
//     max-width: 55em;
//     min-height: 32em;

//     .md-dialog-content {
//       max-height: 40em;
//       overflow: scroll;
//     }
//   }
// `;

class License extends Component {
  static propTypes = {
    fetchLicense: PropTypes.func.isRequired,
    updateLicense: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    updatedLicenseInfoPending: PropTypes.bool.isRequired,
    unloadLicense: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    modal: PropTypes.object.isRequired,
    hideLicenseModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchLicense } = this.props;
    fetchLicense('root');
  }

  componentWillUnmount() {
    const { unloadLicense } = this.props;
    unloadLicense();
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
      <DialogContainer
        id="license-modal"
        visible={this.props.modal.visible}
        title="License"
        closeOnEsc
        onHide={this.props.hideLicenseModal}
        width="60%"
      >
        {isPending ?
          <ActivityContainer id="license-load" /> :
          <LicenseForm
            submitLabel="Update"
            cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
            onSubmit={values => this.update(values)}
            {...this.props}
          />}
      </DialogContainer>
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

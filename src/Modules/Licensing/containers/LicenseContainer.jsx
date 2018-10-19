import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { DialogContainer } from 'react-md';
import { ActivityContainer } from 'components/ProgressIndicators';
import LicenseForm from './LicenseForm';
import validate from '../validations';
import actions from '../actions';

class License extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    fetchLicense: PropTypes.func.isRequired,
    updateLicense: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    updatedLicenseInfoPending: PropTypes.bool.isRequired,
    unloadLicense: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
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
    const { visible, hideLicenseModal, pending, updatedLicenseInfoPending } = this.props;
    const isPending = pending || updatedLicenseInfoPending;

    return (
      <DialogContainer
        id="license-modal"
        visible={visible}
        title="License"
        closeOnEsc
        onHide={hideLicenseModal}
        width="60%"
      >
        {isPending && <ActivityContainer id="license-load" />}
        <LicenseForm
          submitLabel="Update"
          cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
          onSubmit={values => this.update(values)}
          pending={isPending}
          {...this.props}
        />
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
  };
}


export default connect(mapStateToProps, actions)(reduxForm({
  form: 'licenseForm',
  validate
})(License));

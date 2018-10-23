import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DialogContainer } from 'react-md';
import { Form } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import LicenseForm from './LicenseForm';
import actions from '../actions';

class License extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    fetchLicense: PropTypes.func.isRequired,
    updateLicense: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    unloadLicense: PropTypes.func.isRequired,
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

  update = (values) => {
    const { updateLicense, hideLicenseModal } = this.props;
    const { properties } = values;

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
    const { visible, hideLicenseModal, pending } = this.props;

    return (
      <DialogContainer
        id="license-modal"
        visible={visible}
        title="License"
        closeOnEsc
        onHide={hideLicenseModal}
        defaultVisibleTransitionable
        width="60%"
        height="60%"
      >
        {pending && <ActivityContainer id="license-load" />}
        <Form
          component={LicenseForm}
          onSubmit={this.update}
          pending={pending}
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
  };
}


export default connect(mapStateToProps, actions)(License);

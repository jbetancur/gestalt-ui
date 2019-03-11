import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Form } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LicenseForm from './LicenseForm';
import actions from '../actions';

const DialogContentCustom = styled(DialogContent)`
  min-height: 500px;
`;

const initialFormValues = {
  properties: {
    data: ''
  }
};

class License extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    fetchLicense: PropTypes.func.isRequired,
    updateLicense: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    unloadLicense: PropTypes.func.isRequired,
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
    const { modal, updateLicense } = this.props;
    const { properties } = values;

    const payload = {
      name: 'gestalt-license',
      properties: {
        data: properties.data
      }
    };

    updateLicense('root', payload).then(() => {
      modal.hideModal();
    });
  }

  render() {
    const { modal, pending } = this.props;

    return (
      <Dialog
        id="license-modal"
        aria-labelledby="license-title"
        aria-describedby="license-description"
        open={modal.open}
        onClose={modal.hideModal}
        onExited={modal.destroyModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="license-scale-title">Licenseing</DialogTitle>
        {pending && <ActivityContainer id="license-load" />}
        <DialogContentCustom>
          <Form
            component={LicenseForm}
            onSubmit={this.update}
            pending={pending}
            initialValues={initialFormValues}
            onClose={modal.hideModal}
            {...this.props}
          />
        </DialogContentCustom>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { license } = state.licensing;

  return {
    pending: license.pending,
    licenseInfo: license.license,
  };
}


export default connect(mapStateToProps, actions)(License);

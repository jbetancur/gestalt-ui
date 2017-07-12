import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import ActivityContainer from 'components/ActivityContainer';
import LicenseForm from '../../components/LicenseForm';
import validate from '../../validations';
import actions from '../../actions';

class License extends Component {
  static propTypes = {
    fetchLicense: PropTypes.func.isRequired,
    updateLicense: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    onUnloadLicense: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
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
    const { updateLicense, reset } = this.props;
    const payload = {
      name: 'gestalt-license',
      properties: {
        data: properties.data
      }
    };

    updateLicense('root', payload, reset);
  }

  render() {
    const { pending } = this.props;
    return pending ? <ActivityContainer id="license-load" /> : <LicenseForm submitLabel="Update" cancelLabel="Cancel" onSubmit={values => this.update(values)} {...this.props} />;
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
})(context(License)));

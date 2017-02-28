import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import * as actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createOrg: PropTypes.func.isRequired
  };

  createOrg(values) {
    const payload = {
      name: values.name,
      description: values.description,
      properties: {
        env: {}
      }
    };

    if (values.variables) {
      values.variables.forEach((variable) => {
        payload.properties.env[variable.name] = variable.value;
      });
    }

    this.props.createOrg(this.props.params.fqon, payload);
  }

  render() {
    return (
      <ContainmentForm
        title="Create Organization"
        submitLabel="Create"
        cancelLabel="Cancel"
        onSubmit={values => this.createOrg(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { organization, pending } = state.organizations.fetchOne;

  return {
    organization,
    pending,
    initialValues: {
      name: '',
      description: '',
      properties: {
        env: {}
      }
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'organizationCreate',
  validate
})(OrgCreate));

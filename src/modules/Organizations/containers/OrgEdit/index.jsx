import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import { map } from 'lodash';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import * as actions from '../../actions';

class OrgEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    fetchOrg: PropTypes.func.isRequired,
    updateOrg: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.fetchOrg(this.props.params.fqon);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  updatedModel(formValues) {
    const { name, description } = formValues;
    const model = {
      name,
      description,
      properties: {
        env: {}
      }
    };

    // variables is a used for tracking out FieldArray
    formValues.variables.forEach((variable) => {
      model.properties.env[variable.key] = variable.value;
    });

    return model;
  }

  originalModel(originalOrg) {
    const { name, description, properties } = originalOrg;
    const { env } = properties;

    return {
      name,
      description,
      properties: { env }
    };
  }

  updateOrg(values) {
    const { properties } = this.props.organization;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(this.props.organization);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    this.props.updateOrg(properties.fqon, patches);
  }

  render() {
    return (
      <ContainmentForm
        title={this.props.organization.name}
        submitLabel="Update"
        cancelLabel="Cancel"
        onSubmit={values => this.updateOrg(values)}
        envMap={this.props.organization.properties.env}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { organization, pending } = state.organizations.fetchOne;
  const variables = map(organization.properties.env, (value, key) => ({ key, value }));

  return {
    organization,
    pending,
    initialValues: {
      name: organization.name,
      description: organization.description,
      properties: organization.properties,
      variables,
    },
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'organizationEdit',
  validate
})(OrgEdit));

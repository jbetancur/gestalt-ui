import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import _map from 'lodash/map';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import * as actions from '../../actions';

class OrgEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    fetchOrg: PropTypes.func.isRequired,
    updateOrg: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchOrg(this.props.params.fqon);
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
  const { item, pending } = state.organizations.fetchOne;
  const variables = _map(item.properties.env, (value, key) => ({ key, value }));

  return {
    organization: item,
    pending,
    initialValues: {
      name: item.name,
      description: item.description,
      properties: item.properties,
      variables
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'organizationEdit',
  validate
})(OrgEdit));

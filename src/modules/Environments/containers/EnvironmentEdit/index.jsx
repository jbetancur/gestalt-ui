import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import _map from 'lodash/map';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import * as actions from '../../actions';

class EnvironmentEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    updateEnvironment: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchEnvironment(params.fqon, params.environmentId);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  updatedModel(formValues) {
    const { name, description, properties } = formValues;
    const model = {
      name,
      description,
      properties: {
        environment_type: properties.environment_type,
        env: {}
      }
    };

    // variables is a used for tracking out FieldArray
    formValues.variables.forEach((variable) => {
      model.properties.env[variable.name] = variable.value;
    });

    return model;
  }

  originalModel(originalOrg) {
    const { name, description, properties } = originalOrg;
    const { env, environment_type } = properties;

    return {
      name,
      description,
      properties: {
        environment_type,
        env
      }
    };
  }

  updateEnvironment(values) {
    const { id } = this.props.environment;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(this.props.environment);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    this.props.updateEnvironment(this.props.params.fqon, id, patches);
  }

  render() {
    const { environment } = this.props;

    return (
      <ContainmentForm
        title={environment.description || environment.name}
        submitLabel="Update"
        cancelLabel="Cancel"
        onSubmit={values => this.updateEnvironment(values)}
        envMap={environment.properties.env}
        isEnvironment
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { environment, pending } = state.environments.fetchOne;
  const variables = _map(environment.properties.env, (value, name) => ({ name, value }));

  return {
    environment,
    pending,
    initialValues: {
      name: environment.name,
      description: environment.description,
      properties: environment.properties,
      variables
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'environmentEdit',
  validate
})(EnvironmentEdit));

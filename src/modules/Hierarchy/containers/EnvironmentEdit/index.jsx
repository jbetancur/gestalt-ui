import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import _map from 'lodash/map';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';

class EnvironmentEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    updateEnvironment: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.fetchEnvironment(match.params.fqon, match.params.environmentId);
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
    const { history } = this.props;
    const { id } = this.props.environment;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(this.props.environment);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    const onSuccess = () => history.goBack();
    this.props.updateEnvironment(this.props.match.params.fqon, id, patches, onSuccess);
  }

  render() {
    const { environment } = this.props;

    return (
      <HierarchyForm
        title={environment.description || environment.name}
        submitLabel="Update"
        cancelLabel="Back"
        onSubmit={values => this.updateEnvironment(values)}
        envMap={environment.properties.env}
        isEnvironment
        editMode
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { environment, pending } = state.metaResource.environment;
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

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'environmentEdit',
  validate
})(context(EnvironmentEdit)));

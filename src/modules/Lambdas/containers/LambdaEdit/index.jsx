import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import { map } from 'lodash';
import LambdaForm from '../../components/LambdaForm';
import validate from '../../validations';
import * as actions from '../../actions';

class LambdaEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    lambda: PropTypes.object.isRequired,
    fetchLambda: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    updateLambda: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { params, fetchLambda, fetchProviders } = this.props;
    // init providers dropdown
    fetchProviders(params.fqon, params.environmentId, 'ApiGateway');
    fetchLambda(params.fqon, params.lambdaId);
  }

  componentWillUnmount() {
    const { onUnload } = this.props;
    onUnload();
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
      model.properties.env[variable.key] = variable.value;
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

  updateLambda(values) {
    const { id } = this.props.lambda;
    const { lambda, params } = this.props;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(lambda);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    this.props.updateLambda(params.fqon, id, patches);
  }

  render() {
    const { lambda, pending } = this.props;
    return pending ? <CircularActivity id="lambda-load" /> : <LambdaForm editMode title={lambda.name} submitLabel="Update" cancelLabel="Cancel" onSubmit={values => this.updateLambda(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { lambda, pending } = state.lambdas.fetchOne;
  const variables = map(lambda.properties.env, (value, key) => ({ key, value }));

  const model = {
    name: lambda.name,
    description: lambda.description,
    properties: {
      env: lambda.properties.env,
      headers: lambda.properties.headers,
      code_type: lambda.properties.code_type,
      compressed: lambda.properties.compressed,
      cpus: lambda.properties.cpus,
      memory: lambda.properties.memory,
      timeout: lambda.properties.timeout,
      handler: lambda.properties.handler,
      package_url: lambda.properties.package_url,
      public: lambda.properties.public,
      synchronous: lambda.properties.synchronous,
      runtime: lambda.properties.runtime,
      // Providers is really an array of {id, locations[]}
      providers: lambda.properties.providers && lambda.properties.providers.length ? lambda.properties.providers[0].id : '',
    },
    variables
  };

  return {
    lambda,
    pending,
    lambdaUpdatePending: state.lambdas.lambdaUpdate.pending,
    pendingProviders: state.lambdas.providers.pending,
    providers: state.lambdas.providers.providers,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'lambdaEdit',
  validate
})(LambdaEdit));

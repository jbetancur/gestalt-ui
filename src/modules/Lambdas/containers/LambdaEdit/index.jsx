import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import { map, cloneDeep } from 'lodash';
import base64 from 'base-64';
import LambdaForm from '../../components/LambdaForm';
import validate from '../../validations';
import actions from '../../actions';

class LambdaEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    lambda: PropTypes.object.isRequired,
    fetchLambda: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    fetchExecutors: PropTypes.func.isRequired,
    updateLambda: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchLambda, fetchProvidersByType, fetchExecutors } = this.props;
    // init providers dropdown
    fetchProvidersByType(match.params.fqon, match.params.environmentId, 'environments', 'Lambda');
    fetchExecutors(match.params.fqon, match.params.environmentId, 'environments', 'Executor');
    fetchLambda(match.params.fqon, match.params.lambdaId, match.params.environmentId);
  }

  updatedModel(formValues) {
    const { name, description, properties } = formValues;
    const model = cloneDeep({
      name,
      description,
      properties: {
        env: {},
        headers: properties.headers,
        code_type: properties.code_type,
        compressed: properties.compressed,
        cpus: properties.cpus,
        memory: properties.memory,
        timeout: properties.timeout,
        handler: properties.handler,
        package_url: properties.package_url,
        public: properties.public,
        runtime: properties.runtime,
        provider: properties.provider,
        periodic_info: properties.periodic_info
      }
    });

    if (formValues.properties.code) {
      model.properties.code = base64.encode(formValues.properties.code);
    }

    if (formValues.properties.periodic_info && !formValues.properties.periodic_info.schedule) {
      delete model.properties.periodic_info;
    }

    // variables is used for tracking our FieldArray
    formValues.variables.forEach((variable) => {
      model.properties.env[variable.name] = variable.value;
    });

    return model;
  }

  originalModel(originalOrg) {
    const { name, description, properties } = originalOrg;
    const model = {
      name,
      description,
      properties: {
        env: properties.env,
        headers: properties.headers,
        code: properties.code,
        code_type: properties.code_type,
        compressed: properties.compressed,
        cpus: properties.cpus,
        memory: properties.memory,
        timeout: properties.timeout,
        handler: properties.handler,
        package_url: properties.package_url,
        public: properties.public,
        runtime: properties.runtime,
        provider: properties.provider,
        periodic_info: properties.periodic_info,
      }
    };

    if (!properties.code) {
      delete model.properties.code;
    }

    return model;
  }

  updateLambda(values) {
    const { id } = this.props.lambda;
    const { lambda, match, history } = this.props;
    const updatedModel = this.updatedModel(values);
    const originalModel = this.originalModel(lambda);
    const patches = jsonPatch.compare(originalModel, updatedModel);
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);

    this.props.updateLambda(match.params.fqon, id, patches, onSuccess);
  }

  render() {
    const { lambda, pending } = this.props;
    return pending ? <CircularActivity id="lambda-load" /> :
    <LambdaForm
      editMode
      title={lambda.name}
      submitLabel="Update"
      cancelLabel="Back"
      onSubmit={values => this.updateLambda(values)}
      {...this.props}
    />;
  }
}

function mapStateToProps(state) {
  const { lambda, pending } = state.metaResource.lambda;
  const variables = map(lambda.properties.env, (value, name) => ({ name, value }));

  const model = {
    name: lambda.name,
    description: lambda.description,
    properties: {
      env: lambda.properties.env,
      headers: lambda.properties.headers,
      code: lambda.properties.code ? base64.decode(lambda.properties.code) : null,
      code_type: lambda.properties.code_type,
      compressed: lambda.properties.compressed,
      cpus: lambda.properties.cpus,
      memory: lambda.properties.memory,
      timeout: lambda.properties.timeout,
      handler: lambda.properties.handler,
      package_url: lambda.properties.package_url,
      public: lambda.properties.public,
      runtime: lambda.properties.runtime,
      provider: lambda.properties.provider,
      periodic_info: lambda.properties.periodic_info,
    },
    variables
  };

  return {
    lambda,
    pending,
    lambdaUpdatePending: state.metaResource.lambdaUpdate.pending,
    pendingProviders: state.metaResource.providersByType.pending,
    providers: state.metaResource.providersByType.providers,
    executors: state.metaResource.executors.executors,
    pendingExecutors: state.metaResource.executors.pending,
    theme: state.lambdas.theme,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'lambdaEdit',
  validate
})(context(LambdaEdit)));

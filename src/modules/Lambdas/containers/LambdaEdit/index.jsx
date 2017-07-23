import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import { mapTo2DArray } from 'util/helpers/transformations';
import base64 from 'base-64';
import LambdaForm from '../../components/LambdaForm';
import validate from '../../validations';
import actions from '../../actions';
import { generateLambdaPatches } from '../../payloadTransformer';

class LambdaEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    lambda: PropTypes.object.isRequired,
    fetchLambda: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    fetchExecutors: PropTypes.func.isRequired,
    updateLambda: PropTypes.func.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchLambda, fetchProvidersByType, fetchExecutors } = this.props;
    // init providers dropdown
    fetchProvidersByType(match.params.fqon, match.params.environmentId, 'environments', 'Lambda');
    fetchExecutors(match.params.fqon, match.params.environmentId, 'environments', 'Executor');
    fetchLambda(match.params.fqon, match.params.lambdaId, match.params.environmentId);
  }

  updateLambda(values) {
    const { lambda, match, history, updateLambda } = this.props;
    const patches = generateLambdaPatches(lambda, values);
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);

    updateLambda(match.params.fqon, lambda.id, patches, onSuccess);
  }

  render() {
    const { lambda, lambdaPending } = this.props;
    return lambdaPending ? <ActivityContainer id="lambda-load" /> :
    <LambdaForm
      editMode
      title={lambda.name}
      submitLabel="Update"
      cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
      onSubmit={values => this.updateLambda(values)}
      {...this.props}
    />;
  }
}

function mapStateToProps(state) {
  const { lambda } = state.metaResource.lambda;

  const model = {
    name: lambda.name,
    description: lambda.description,
    properties: {
      env: mapTo2DArray(lambda.properties.env),
      headers: lambda.properties.headers,
      code: lambda.properties.code && base64.decode(lambda.properties.code),
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
      // TODO: Refactor this into some model
      periodic_info: {
        payload: {
          data: lambda.properties.periodic_info && lambda.properties.periodic_info.payload && lambda.properties.periodic_info.payload.data && base64.decode(lambda.properties.periodic_info.payload.data),
          eventName: lambda.properties.periodic_info && lambda.properties.periodic_info.payload && lambda.properties.periodic_info.payload.eventName,
        },
        schedule: lambda.properties.periodic_info && lambda.properties.periodic_info.schedule,
        timezone: lambda.properties.periodic_info && lambda.properties.periodic_info.timezone,
      },
    },
  };

  return {
    lambda,
    theme: state.lambdas.theme,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'lambdaEdit',
  validate
})(withContext(LambdaEdit))));

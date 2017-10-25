import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { withContext, Breadcrumbs, ContextNavigation } from 'Modules/ContextManagement';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import { generateContextEntityState } from 'util/helpers/transformations';
import ProviderForm from '../components/ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPayload } from '../payloadTransformer';

class ProviderCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createProvider: PropTypes.func.isRequired,
    /* container related */
    containerValues: PropTypes.object,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
    pristine: PropTypes.bool.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    containerValues: {},
  };

  componentDidMount() {
    const { match, fetchProvidersByType } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchProvidersByType(match.params.fqon, entity.id, entity.key, null, false);
  }

  create(values) {
    const { match, history, createProvider, containerValues, volumes, portMappings, healthChecks } = this.props;
    const mergeProps = [
      {
        key: 'volumes',
        value: volumes,
      },
      {
        key: 'port_mappings',
        value: portMappings,
      },
      {
        key: 'health_checks',
        value: healthChecks,
      }
    ];

    const payload = generateProviderPayload(values, mergeProps, containerValues);
    const onSuccess = () => history.goBack();

    // Create it
    if (match.params.workspaceId && !match.params.environmentId) {
      createProvider(match.params.fqon, match.params.workspaceId, 'workspaces', payload, onSuccess);
    } else if (match.params.environmentId) {
      createProvider(match.params.fqon, match.params.environmentId, 'environments', payload, onSuccess);
    } else {
      createProvider(match.params.fqon, null, null, payload, onSuccess);
    }
  }

  componentDidCatch(error, info) {
    // TODO: Eeat errors related to calling fetchEnvSchema and redux-form FieldArrays and don't unmount the form
    this.setState({ hasError: true, error, info });
  }

  render() {
    return (
      <div>
        <ContextNavigation
          breadcrumbComponent={<Breadcrumbs />}
        />
        <ProviderForm
          title="Create Provider"
          submitLabel="Create"
          cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
          onSubmit={values => this.create(values)}
          {...this.props}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const model = {
    ...metaModels.providers,
    properties: {
      environment_types: '', // converted to Array on Create
      config: {
        external_protocol: 'https',
        env: state.metaResource.envSchema.schema,
      },
    },
  };

  return {
    provider: model,
    initialValues: model,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true, // keeps dirty values in forms when the provider type is changed
    containerValues: getFormValues('containerCreate')(state),
    volumes: state.volumeModal.volumes.volumes,
    portMappings: state.portmapModal.portMappings.portMappings,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
  };
}

export default withMetaResource(connect(mapStateToProps, { ...actions })(reduxForm({
  form: 'providerCreate',
  validate,
})(withContext(ProviderCreate))));

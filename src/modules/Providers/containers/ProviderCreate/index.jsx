import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../components/ProviderForm/validations';
import actions from '../../actions';
import { generateProviderPayload } from '../../payloadTransformer';

class ProviderCreate extends PureComponent {
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
  };

  static defaultProps = {
    containerValues: {},
  };

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

    let onSuccess;
    if (match.params.workspaceId && !match.params.environmentId) {
      onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}`);
    } else if (match.params.environmentId) {
      onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);
    } else {
      onSuccess = () => history.replace(`/${match.params.fqon}/providers`);
    }

    // Create it
    if (match.params.workspaceId && !match.params.environmentId) {
      createProvider(match.params.fqon, match.params.workspaceId, 'workspaces', payload, onSuccess);
    } else if (match.params.environmentId) {
      createProvider(match.params.fqon, match.params.environmentId, 'environments', payload, onSuccess);
    } else {
      createProvider(match.params.fqon, null, null, payload, onSuccess);
    }
  }

  render() {
    return (
      <ProviderForm
        title="Create Provider"
        submitLabel="Create"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.create(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const model = {
    name: '',
    description: '',
    properties: {
      config: {
        auth: {},
        external_protocol: 'https',
        env: {
          public: state.metaResource.envSchema.schema.public,
          private: state.metaResource.envSchema.schema.private,
        },
      },
      linked_providers: [],
      services: [],
      locations: [],
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

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'providerCreate',
  validate,
})(withContext(ProviderCreate))));

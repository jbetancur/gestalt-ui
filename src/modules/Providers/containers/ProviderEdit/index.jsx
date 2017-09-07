import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext, Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { containerActionCreators } from 'modules/Containers';
import base64 from 'base-64';
import { mapTo2DArray } from 'util/helpers/transformations';
import ActivityContainer from 'components/ActivityContainer';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../components/ProviderForm/validations';
import actions from '../../actions';
import { generateProviderPatches } from '../../payloadTransformer';

class ProviderEdit extends PureComponent {
  static propTypes = {
    providerPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    fetchProviderContainer: PropTypes.func.isRequired,
    fetchProvider: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired,
    confirmUpdate: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchProvider, fetchProvidersByType, fetchProviderContainer } = this.props;
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.enviromentId ? 'environments' : 'workspaces';

    fetchProvidersByType(match.params.fqon, entityId, entityKey);
    fetchProvider(match.params.fqon, match.params.providerId);
    fetchProviderContainer(match.params.fqon, match.params.providerId);
  }

  update(formValues) {
    const { match, history, confirmUpdate, provider, updateProvider } = this.props;
    const patches = generateProviderPatches(provider, formValues);

    let onSuccess;
    if (match.params.workspaceId && !match.params.environmentId) {
      onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}`);
    } else if (match.params.environmentId) {
      onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);
    } else {
      onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);
    }

    // If the provider has a container defined then warn the user of an impending container restart
    if (provider.properties.services && provider.properties.services.length) {
      confirmUpdate(() => updateProvider(match.params.fqon, provider.id, patches, onSuccess), provider.name);
    } else {
      updateProvider(match.params.fqon, provider.id, patches, onSuccess);
    }
  }

  render() {
    const { provider, providerPending } = this.props;

    return (
      <div>
        <ContextNavigation
          breadcrumbComponent={<Breadcrumbs />}
        />
        {providerPending ?
          <ActivityContainer id="provider-load" /> :
          <ProviderForm
            editMode
            title={provider.name}
            submitLabel="Update"
            cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
            onSubmit={values => this.update(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { provider } = state.metaResource.provider;
  const model = {
    name: provider.name,
    description: provider.description,
    resource_type: provider.resource_type,
    properties: {
      config: {
        auth: provider.properties.config.auth,
        url: provider.properties.config.url,
        external_protocol: provider.properties.config.external_protocol,
        env: {
          public: mapTo2DArray(provider.properties.config.env.public),
          private: mapTo2DArray(provider.properties.config.env.private),
        },
        networks: JSON.stringify(provider.properties.config.networks),
        extra: JSON.stringify(provider.properties.config.extra),
      },
      linked_providers: provider.properties.linked_providers,
      data: provider.properties.data ? base64.decode(provider.properties.data) : '',
      locations: provider.properties.locations,
      services: provider.properties.services,
    },
  };

  return {
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, containerActionCreators))(reduxForm({
  form: 'providerCreate',
  validate
})(withContext(ProviderEdit))));

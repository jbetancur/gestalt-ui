import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import APIForm from '../../components/APIForm';
import validate from '../../validations';
import * as actions from '../../actions';

class APIEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    fetchAPI: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    updateAPI: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { params, fetchAPI, fetchProvidersByType } = this.props;
    fetchProvidersByType(params.fqon, params.environmentId, 'environments', 'GatewayManager');
    fetchAPI(params.fqon, params.apiId);
  }

  updateAPI(values) {
    const { id, name, description, properties } = this.props.api;
    const { params } = this.props;
    const originalModel = {
      name,
      description,
      properties: {
        provider: properties.provider.id,
      }
    };

    const patches = jsonPatch.compare(originalModel, values);

    this.props.updateAPI(params.fqon, params.environmentId, id, patches);
  }

  render() {
    const { api, pending } = this.props;
    return pending ? <CircularActivity id="api-loading" /> : <APIForm editMode title={api.name} submitLabel="Update" cancelLabel="Done" onSubmit={values => this.updateAPI(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { api, pending } = state.metaResource.api;

  const model = {
    name: api.name,
    description: api.description,
    properties: {
      provider: api.properties.provider,
    }
  };

  return {
    api,
    pending,
    providers: state.metaResource.providersByType.providers,
    pendingProviders: state.metaResource.providersByType.pending,
    updatedApi: state.metaResource.apiUpdate.api,
    apiUpdatePending: state.metaResource.apiUpdate.pending,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'apiEdit',
  validate
})(APIEdit));

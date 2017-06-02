import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import APIForm from '../../components/APIForm';
import validate from '../../validations';
import * as actions from '../../actions';

class APICreate extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createAPI: PropTypes.func.isRequired,
    providers: PropTypes.array.isRequired,
  };

  create(values) {
    const { params, router, createAPI, providers } = this.props;
    const payload = { ...values };

    // TODO: this will eventually go away
    // get the gateway provider Id from our frankenstein provider
    const selectedProvider = providers.find(provider => provider.id === payload.properties.provider.locations);
    payload.properties.provider.id = selectedProvider.properties.gatewayProvider && selectedProvider.properties.gatewayProvider.id; // this is really the Gatewayprovier.id
    // locations is an array, but we only need the first value to be the kong id
    payload.properties.provider.locations = [payload.properties.provider.locations]; // this is really the kong provider id

    const onSuccess = response => router.replace(`${params.fqon}/hierarchy/${params.workspaceId}/environments/${params.environmentId}/apis/${response.id}/edit`);

    if (!payload.properties.provider.id) {
      this.props.dispatch({ type: 'APP_ERROR_GENERAL', payload: 'Unable to create API. You must create and link a gateway manager provider type first' });
    } else {
      createAPI(params.fqon, params.environmentId, payload, onSuccess);
    }
  }

  render() {
    return <APIForm title="Create API" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.metaResource.api;
  const model = {
    name: '',
    description: '',
    properties: {
      provider: {},
    }
  };

  return {
    api: model,
    pending,
    providers: state.metaResource.fetchProviderKongsByGateway.providers,
    pendingProviders: state.metaResource.fetchProviderKongsByGateway.pending,
    initialValues: model,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'APICreate',
  validate
})(APICreate));

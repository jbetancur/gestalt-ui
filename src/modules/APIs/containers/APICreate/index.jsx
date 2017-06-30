import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import APIForm from '../../components/APIForm';
import validate from '../../validations';
import actions from '../../actions';

class APICreate extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createAPI: PropTypes.func.isRequired,
    providersKongByGateway: PropTypes.array.isRequired,
  };

  create(values) {
    const { match, history, createAPI, providersKongByGateway } = this.props;
    const payload = { ...values };

    // TODO: this will eventually go away
    // get the gateway provider Id from our frankenstein provider
    const selectedProvider = providersKongByGateway.find(provider => provider.id === payload.properties.provider.locations);
    payload.properties.provider.id = selectedProvider.properties.gatewayProvider && selectedProvider.properties.gatewayProvider.id; // this is really the Gatewayprovier.id
    // locations is an array, but we only need the first value to be the kong id
    payload.properties.provider.locations = [payload.properties.provider.locations]; // this is really the kong provider id

    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/${response.id}/edit`);

    if (!payload.properties.provider.id) {
      this.props.dispatch({ type: 'APP_ERROR_GENERAL', payload: 'Unable to create API. You must create and link a gateway manager provider type first' });
    } else {
      createAPI(match.params.fqon, match.params.environmentId, payload, onSuccess);
    }
  }

  render() {
    return <APIForm title="Create API" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps() {
  const model = {
    name: '',
    description: '',
    properties: {
      provider: {},
    }
  };

  return {
    api: model,
    initialValues: model,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'APICreate',
  validate
})(context(APICreate))));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import { context } from 'modules/ContextManagement';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import APIForm from '../../components/APIForm';
import validate from '../../validations';
import actions from '../../actions';

class APIEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    fetchAPI: PropTypes.func.isRequired,
    fetchProviderKongsByGateway: PropTypes.func.isRequired,
    updateAPI: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchAPI, fetchProviderKongsByGateway } = this.props;
    fetchProviderKongsByGateway(match.params.fqon, match.params.environmentId, 'environments');
    fetchAPI(match.params.fqon, match.params.apiId);
  }

  updateAPI(values) {
    const { id, name, description } = this.props.api;
    const { match } = this.props;
    const originalModel = {
      name,
      description,
    };

    const newModel = {
      name: values.name,
      description: values.description,
    };

    const patches = jsonPatch.compare(originalModel, newModel);

    this.props.updateAPI(match.params.fqon, match.params.environmentId, id, patches);
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
      provider: {
        locations: api.properties.provider.locations.length && api.properties.provider.locations[0],
      },
    }
  };

  return {
    api,
    pending,
    providers: state.metaResource.fetchProviderKongsByGateway.providers,
    pendingProviders: state.metaResource.fetchProviderKongsByGateway.pending,
    updatedApi: state.metaResource.apiUpdate.api,
    apiUpdatePending: state.metaResource.apiUpdate.pending,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'apiEdit',
  validate
})(context(APIEdit)));

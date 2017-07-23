import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'modules/MetaResource';
import { withContext } from 'modules/ContextManagement';
import ActivityContainer from 'components/ActivityContainer';
import APIForm from '../../components/APIForm';
import validate from '../../validations';
import actions from '../../actions';
import { generateAPIPatches } from '../../payloadTransformer';

class APIEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    fetchAPI: PropTypes.func.isRequired,
    fetchProviderKongsByGateway: PropTypes.func.isRequired,
    updateAPI: PropTypes.func.isRequired,
    apiPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchAPI, fetchProviderKongsByGateway } = this.props;
    fetchProviderKongsByGateway(match.params.fqon, match.params.environmentId, 'environments');
    fetchAPI(match.params.fqon, match.params.apiId);
  }

  updateAPI(values) {
    const { match, api, updateAPI } = this.props;
    const patches = generateAPIPatches(api, values);

    updateAPI(match.params.fqon, match.params.environmentId, api.id, patches);
  }

  render() {
    const { api, apiPending } = this.props;
    return apiPending ? <ActivityContainer id="api-loading" /> : <APIForm editMode title={api.name} submitLabel="Update" cancelLabel="Done" onSubmit={values => this.updateAPI(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { api } = state.metaResource.api;

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
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'apiEdit',
  validate
})(withContext(APIEdit))));

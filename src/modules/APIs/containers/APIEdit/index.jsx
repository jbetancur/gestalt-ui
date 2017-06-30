import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'modules/MetaResource';
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
    apiPending: PropTypes.bool.isRequired,
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
    const { api, apiPending } = this.props;
    return apiPending ? <CircularActivity id="api-loading" /> : <APIForm editMode title={api.name} submitLabel="Update" cancelLabel="Done" onSubmit={values => this.updateAPI(values)} {...this.props} />;
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
})(context(APIEdit))));

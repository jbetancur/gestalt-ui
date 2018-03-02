import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import ActivityContainer from 'components/ActivityContainer';
import APIForm from '../components/APIForm';
import validate from '../validations';
import actions from '../actions';
import { generateAPIPatches } from '../payloadTransformer';

class APIEdit extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    fetchAPI: PropTypes.func.isRequired,
    fetchProviderKongsByGateway: PropTypes.func.isRequired,
    updateAPI: PropTypes.func.isRequired,
    apiPending: PropTypes.bool.isRequired,
    unloadAPI: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchAPI, fetchProviderKongsByGateway } = this.props;

    fetchProviderKongsByGateway(match.params.fqon, match.params.environmentId, 'environments');
    fetchAPI(match.params.fqon, match.params.apiId);
  }

  componentWillUnmount() {
    const { unloadAPI } = this.props;

    unloadAPI();
  }

  updateAPI(values) {
    const { match, api, updateAPI, dispatch, reset } = this.props;
    const patches = generateAPIPatches(api, values);
    const onSuccess = () => dispatch(reset());

    updateAPI(match.params.fqon, match.params.environmentId, api.id, patches, onSuccess);
  }

  render() {
    const { api, apiPending } = this.props;

    return (
      <div>
        {apiPending && !api.id ?
          <ActivityContainer id="api-loading" /> :
          <APIForm
            editMode
            title={api.name}
            submitLabel="Update"
            cancelLabel="APIs"
            onSubmit={values => this.updateAPI(values)}
            {...this.props}
          />}
      </div>
    );
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
  };
}

export default compose(
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'apiEdit',
    enableReinitialize: true,
    validate,
  })
)(APIEdit);

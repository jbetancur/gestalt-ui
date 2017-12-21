import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import { parse } from 'query-string';
import APIEndpointForm from '../components/APIEndpointForm';
import validate from '../components/APIEndpointForm/validations';
import actions from '../actions';
import { generateAPIEndpointPatches } from '../payloadTransformer';

class APIEndpointEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    apiEndpoint: PropTypes.object.isRequired,
    fetchAPIEndpoint: PropTypes.func.isRequired,
    updateAPIEndpoint: PropTypes.func.isRequired,
    fetchContainersDropDown: PropTypes.func.isRequired,
    fetchLambdasDropDown: PropTypes.func.isRequired,
    apiEndpointPending: PropTypes.bool.isRequired,
    unloadAPIEndpoint: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, history, fetchAPIEndpoint, fetchContainersDropDown, fetchLambdasDropDown } = this.props;
    const query = parse(window.location.search);

    if (query.implementationType === 'container') {
      fetchContainersDropDown(match.params.fqon, match.params.environmentId);
    } else if (query.implementationType === 'lambda') {
      fetchLambdasDropDown(match.params.fqon);
    } else {
      // if the search params are missing then go back to the API parent
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`);
    }

    fetchAPIEndpoint(match.params.fqon, match.params.apiEndpointId);
  }

  componentWillUnmount() {
    const { unloadAPIEndpoint } = this.props;

    unloadAPIEndpoint();
  }

  updateAPIEndpoint(values) {
    const { match, history, apiEndpoint, updateAPIEndpoint } = this.props;
    const patches = generateAPIEndpointPatches(apiEndpoint, values);

    if (patches.length) {
      const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`);
      updateAPIEndpoint(match.params.fqon, apiEndpoint.id, patches, onSuccess);
    }
  }

  render() {
    const { apiEndpoint, apiEndpointPending } = this.props;

    return (
      <div>
        {apiEndpointPending ?
          <ActivityContainer id="apiEndpoint-loading" /> :
          <APIEndpointForm
            editMode
            title={apiEndpoint.properties.resource}
            submitLabel="Update"
            cancelLabel={`${apiEndpoint.properties.parent && apiEndpoint.properties.parent.name} API`}
            onSubmit={values => this.updateAPIEndpoint(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { apiEndpoint } = state.metaResource.apiEndpoint;

  const model = {
    name: apiEndpoint.name,
    description: apiEndpoint.description,
    properties: {
      ...apiEndpoint.properties,
      plugins: {
        ...apiEndpoint.properties.plugins,
      }
    },
  };

  // TODO: move this logic to reselect
  if (model.properties.methods && Array.isArray(model.properties.methods)) {
    model.properties.methods = model.properties.methods.join(',');
  }

  return {
    apiEndpoint,
    initialValues: model,
  };
}

export default compose(
  withMetaResource,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'apiEndpointEdit',
    enableReinitialize: true,
    validate
  })
)(APIEndpointEdit);

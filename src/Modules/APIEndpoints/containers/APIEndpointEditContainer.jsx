import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import APIEndpointForm from '../components/APIEndpointForm';
import validate from '../components/APIEndpointForm/validations';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditEndpointModel, selectAPIEndpoint } from '../selectors';

class APIEndpointEdit extends PureComponent {
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
    const { match, fetchAPIEndpoint } = this.props;

    fetchAPIEndpoint(match.params.fqon, match.params.apiEndpointId);
  }

  componentWillReceiveProps(nextProps) {
    const { match, fetchContainersDropDown, fetchLambdasDropDown } = nextProps;

    // update the ui to the correct api type
    if (nextProps.apiEndpoint.id !== this.props.apiEndpoint.id) {
      if (nextProps.apiEndpoint.properties.implementation_type === 'container') {
        fetchContainersDropDown(match.params.fqon, match.params.environmentId);
      } else {
        fetchLambdasDropDown(match.params.fqon);
      }
    }
  }

  componentWillUnmount() {
    const { unloadAPIEndpoint } = this.props;

    unloadAPIEndpoint();
  }

  updateAPIEndpoint(values) {
    const { match, history, apiEndpoint, updateAPIEndpoint } = this.props;
    const patches = generatePatches(apiEndpoint, values);

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

const mapStateToProps = state => ({
  apiEndpoint: selectAPIEndpoint(state),
  initialValues: getEditEndpointModel(state),
});

export default compose(
  withMetaResource,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'apiEndpointEdit',
    enableReinitialize: true,
    validate
  })
)(APIEndpointEdit);

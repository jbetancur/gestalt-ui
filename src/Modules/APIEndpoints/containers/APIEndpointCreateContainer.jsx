import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import APIEndpointForm from './APIEndpointForm';
import validate from './APIEndpointForm/validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateEndpointModel } from '../selectors';

class APIEndpointCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createAPIEndpoint: PropTypes.func.isRequired,
  };

  create = (values) => {
    const { match, history, createAPIEndpoint } = this.props;
    const payload = generatePayload(values);

    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`);
    createAPIEndpoint(match.params.fqon, match.params.apiId, payload, onSuccess);
  }

  render() {
    return (
      <APIEndpointForm
        title="Create Endpoint"
        submitLabel="Create"
        cancelLabel="API"
        onSubmit={this.create}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  apiEndpoint: getCreateEndpointModel(state),
  initialValues: getCreateEndpointModel(state),
  enableReinitialize: true,
});

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'apiEndpointCreate',
  validate
})(APIEndpointCreate)));

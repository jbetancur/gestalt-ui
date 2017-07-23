import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import APIEndpointForm from '../../components/APIEndpointForm';
import validate from '../../components/APIEndpointForm/validations';
import actions from '../../actions';
import { generateAPIEndpointPayload } from '../../payloadTransformer';

class APIEndpointCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createAPIEndpoint: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  create(values) {
    const { match, history, createAPIEndpoint } = this.props;
    const payload = generateAPIEndpointPayload(values);

    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/${match.params.apiId}/edit`);
    createAPIEndpoint(match.params.fqon, match.params.apiId, payload, onSuccess);
  }

  render() {
    return (
      <APIEndpointForm
        title="Create Endpoint"
        submitLabel="Create"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.create(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps() {
  const model = {
    properties: {
      methods: 'GET',  // converts to array
      plugins: {
        rateLimit: {
          enabled: false,
          perMinute: 60,
        },
        gestaltSecurity: {
          enabled: false,
          users: [],
          groups: [],
        },
      },
      implementation_type: 'lambda',
      resource: '',
      implementation_id: '',
      synchronous: true,
    }
  };

  return {
    apiEndpoint: model,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'apiEndpointCreate',
  validate
})(withContext(APIEndpointCreate))));

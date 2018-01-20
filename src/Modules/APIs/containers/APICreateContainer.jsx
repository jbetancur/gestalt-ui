import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import APIForm from '../components/APIForm';
import validate from '../validations';
import actions from '../actions';
import { generateAPIPayload } from '../payloadTransformer';

class APICreate extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createAPI: PropTypes.func.isRequired,
    providersKongByGateway: PropTypes.array.isRequired,
    fetchProviderKongsByGateway: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchProviderKongsByGateway, match } = this.props;

    fetchProviderKongsByGateway(match.params.fqon, match.params.environmentId, 'environments');
  }

  create(values) {
    const { match, history, createAPI, providersKongByGateway } = this.props;
    const payload = generateAPIPayload(values, providersKongByGateway);

    if (!payload.properties.provider.id) {
      this.props.dispatch({ type: 'APP_ERROR_GENERAL', payload: 'Unable to create API. You must create and link a gateway manager provider type first' });
    } else {
      const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${response.id}`);
      createAPI(match.params.fqon, match.params.environmentId, payload, onSuccess);
    }
  }

  render() {
    return (
      <div>
        <APIForm
          title="Create API"
          submitLabel="Create"
          cancelLabel="APIs"
          onSubmit={values => this.create(values)}
          {...this.props}
        />
      </div>
    );
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
})(APICreate)));

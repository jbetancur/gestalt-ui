import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import SecretForm from './SecretForm';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateSecretModel, selectSecret } from '../selectors';

class SecretCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createSecret: PropTypes.func.isRequired,
  };

  create(values) {
    const { match, history, createSecret } = this.props;
    const payload = generatePayload(values);
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/secrets/${response.id}`);

    createSecret(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return (
      <SecretForm
        title="Create Secret"
        submitLabel="Create"
        cancelLabel="Secrets"
        onSubmit={values => this.create(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    secret: selectSecret(state),
    initialValues: getCreateSecretModel(state),
  };
}

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withMetaResource,
  connect(mapStateToProps, actions),
  reduxForm({
    form: 'secretCreate',
    validate,
  }),
)(SecretCreate);

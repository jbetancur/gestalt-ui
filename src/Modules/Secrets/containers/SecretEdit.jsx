import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import ActivityContainer from 'components/ActivityContainer';
import SecretForm from './SecretForm';
import validate from '../validations';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditSecretModel } from '../selectors';

class SecretEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    secret: PropTypes.object.isRequired,
    fetchSecret: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    updateSecret: PropTypes.func.isRequired,
    secretPending: PropTypes.bool.isRequired,
    unloadSecret: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchSecret, fetchProvidersByType } = this.props;

    fetchProvidersByType(match.params.fqon, match.params.environmentId, 'environments', 'CaaS');
    fetchSecret(match.params.fqon, match.params.secretId);
  }

  componentWillUnmount() {
    const { unloadSecret } = this.props;

    unloadSecret();
  }

  updateSecret(values) {
    const { match, history, secret, updateSecret } = this.props;
    const patches = generatePatches(secret, values);
    const onSuccess = () =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/secrets`);

    updateSecret(match.params.fqon, secret.id, patches, onSuccess);
  }

  render() {
    const { secret, secretPending } = this.props;

    return (
      <div>
        {secretPending && !secret.id ?
          <ActivityContainer id="secret-load" /> :
          <SecretForm
            title={secret.name}
            submitLabel="Update"
            cancelLabel="Secrets"
            onSubmit={values => this.updateSecret(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    initialValues: getEditSecretModel(state),
  };
}

export default compose(
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, actions),
  reduxForm({
    form: 'secretEdit',
    enableReinitialize: true,
    validate,
  })
)(SecretEdit);

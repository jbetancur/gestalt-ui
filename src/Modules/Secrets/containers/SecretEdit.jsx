import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import SecretForm from '../components/SecretForm';
import validate from '../validations';
import actions from '../actions';
import { generateSecretPatches } from '../payloadTransformer';

class SecretEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    secret: PropTypes.object.isRequired,
    fetchSecret: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    updateSecret: PropTypes.func.isRequired,
    secretPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchSecret, fetchProvidersByType } = this.props;

    fetchProvidersByType(match.params.fqon, match.params.environmentId, 'environments', 'CaaS');
    fetchSecret(match.params.fqon, match.params.secretId);
  }

  updateSecret(values) {
    const { match, history, secret, updateSecret } = this.props;
    const patches = generateSecretPatches(secret, values);
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
            cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
            onSubmit={values => this.updateSecret(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { secret } = state.metaResource.secret;
  const model = {
    name: secret.name,
    description: secret.description,
    properties: {
      provider: secret.properties.provider,
      items: secret.properties.items,
    },
  };

  return {
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, actions)(reduxForm({
  form: 'secretEdit',
  validate
})(withContext(SecretEdit))));

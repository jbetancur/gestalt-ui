import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withSecret, withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import SecretForm from './SecretForm';
import validate from '../validations';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditSecretModel } from '../selectors';

class SecretEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    secret: PropTypes.object.isRequired,
    secretActions: PropTypes.object.isRequired,
    secretPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, secretActions } = this.props;

    secretActions.fetchSecret({ fqon: match.params.fqon, id: match.params.secretId });
  }

  update = (values) => {
    const { match, secret, secretActions } = this.props;
    const payload = generatePatches(secret, values);

    secretActions.updateSecret({ fqon: match.params.fqon, id: secret.id, payload });
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
            editMode
            onSubmit={this.update}
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
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withSecret,
  withEntitlements,
  connect(mapStateToProps, actions),
  reduxForm({
    form: 'secretEdit',
    enableReinitialize: true,
    validate,
  })
)(SecretEdit);

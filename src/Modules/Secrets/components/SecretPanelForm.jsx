import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexybox';
import { Field, getFormValues, change } from 'redux-form';
import { Button } from 'components/Buttons';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { ModalFooter } from 'components/Modal';

const required = value => (value ? undefined : ' ');

const SecretForm = (props) => {
  const { fetchSecretsDropDown, secretsDropDown, match, providerId, reset, values } = props;

  const getSecrets = () => fetchSecretsDropDown(match.params.fqon, match.params.environmentId, providerId);
  const handleSecretNamePopulation = (a, secretId) => {
    const secret = secretsDropDown.find(i => i.id === secretId);
    props.dispatch(change(props.form, 'secret_name', secret && secret.name));
  };

  const getSecretKeys = (id) => {
    const item = secretsDropDown.find(s => s.id === id);
    return (item && item.properties && item.properties.items) || [];
  };

  const setSecretMountTypes = () => {
    if (props.providerType === 'Kubernetes') {
      return ['env', 'directory', 'file'];
    }

    return ['env'];
  };

  const getHelpText = (mountType) => {
    switch (mountType) {
      case 'env':
        return 'mount the secret key to this environment variable';
      case 'directory':
        return 'mount all secret keys to this directory';
      case 'file':
        return 'mount secret keys to this file';
      default:
        return '';
    }
  };

  const close = () => {
    props.reset();
    props.hideSecretModal();
  };

  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
      <Field
        id="secret_name"
        name="secret_name"
        component={() => null}
      />
      <Row gutter={5}>
        <Col flex={2} xs={12}>
          <Field
            id="mount_type"
            name="mount_type"
            component={SelectField}
            label="Mount Type"
            menuItems={setSecretMountTypes()}
            onChange={reset}
            required
          />
        </Col>
        <Col flex={5} xs={12}>
          <Field
            id="secret_id"
            name="secret_id"
            component={SelectField}
            label="Secret"
            itemLabel="name"
            itemValue="id"
            required
            menuItems={secretsDropDown}
            async
            onFocus={getSecrets}
            onChange={handleSecretNamePopulation}
            validate={required}
          />
        </Col>
        {values.secret_id && values.mount_type !== 'directory' &&
        <Col flex={5} xs={12}>
          <Field
            id="secret_key"
            name="secret_key"
            component={SelectField}
            label="Key"
            itemLabel="key"
            itemValue="key"
            required
            menuItems={getSecretKeys(values.secret_id)}
            validate={required}
          />
        </Col>}
        {values.secret_id &&
          <Col flex={6} xs={12}>
            <Field
              name="path"
              label={values.mount_type === 'env' ? 'Environment Variable' : 'Path'}
              component={TextField}
              type="text"
              required
              validate={required}
              helpText={getHelpText(values.mount_type)}
            />
          </Col>}
      </Row>
      <ModalFooter>
        <Button
          flat
          onClick={() => close()}
        >
          Cancel
        </Button>
        <Button
          flat
          type="submit"
          disabled={props.pristine || props.invalid || props.submitting}
          primary
        >
          Add Secret
        </Button>
      </ModalFooter>
    </form>
  );
};

SecretForm.propTypes = {
  match: PropTypes.object.isRequired,
  hideSecretModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  providerId: PropTypes.string,
  providerType: PropTypes.string,
  fetchSecretsDropDown: PropTypes.func.isRequired,
  secretsDropDown: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

SecretForm.defaultProps = {
  providerId: '',
  providerType: '',
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(SecretForm);

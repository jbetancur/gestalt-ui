import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';

const required = value => (value ? undefined : 'required');

const setSecretMountTypes = (providerType) => {
  if (providerType === 'Kubernetes') {
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

const getSecretKeys = (id, secrets) => {
  const item = secrets.find(s => s.id === id);
  return (item && item.properties && item.properties.items) || [];
};

const SecretsPanelForm = ({ fields, providerType, secrets, secretFormValues }) => (
  <FieldContainer>
    <FieldItem>
      <Button
        flat
        primary
        iconChildren="add"
        onClick={() => fields.push({})}
      >
        Secret
      </Button>
    </FieldItem>
    {fields.map((member, index) => {
      const field = secretFormValues[index];
      const handleSecretNamePopulation = (dummy, secretId) => {
        const secret = secrets.find(i => i.id === secretId);
        Object.assign(field, { secret_name: secret.name });
      };

      const reset = () => {
        delete field.secret_key;
        delete field.path;
      };

      return (
        <FieldItem key={`sercret-${index}`}>
          {/* hidden field */}
          <Field
            id={`${member}.secret_name`}
            name={`${member}.secret_name`}
            component={() => null}
          />
          <Row gutter={5}>
            <Col flex={1} xs={12} sm={12}>
              <Field
                id={`${member}.mount_type`}
                name={`${member}.mount_type`}
                component={SelectField}
                label="Mount Type"
                onChange={reset}
                menuItems={setSecretMountTypes(providerType)}
                required
              />
            </Col>
            <Col flex={3} xs={12} sm={12}>
              <Field
                id={`${member}.secret_id`}
                name={`${member}.secret_id`}
                component={SelectField}
                label="Secret"
                itemLabel="name"
                itemValue="id"
                required
                menuItems={secrets}
                onChange={handleSecretNamePopulation}
                async
                validate={[required]}
              />
            </Col>
            {field.secret_id && field.mount_type !== 'directory' &&
            <Col flex={3} xs={12} sm={12}>
              <Field
                id={`${member}.secret_key`}
                name={`${member}.secret_key`}
                component={SelectField}
                label="Key"
                itemLabel="key"
                itemValue="key"
                required
                menuItems={getSecretKeys(field.secret_id, secrets)}
                validate={[required]}
              />
            </Col>}
            {field.secret_id &&
              <Col flex={5} xs={12} sm={12}>
                <Field
                  id={`${member}.path`}
                  name={`${member}.path`}
                  label={field.mount_type === 'env' ? 'Environment Variable' : 'Path'}
                  component={TextField}
                  type="text"
                  required
                  validate={[required]}
                  helpText={getHelpText(field.mount_type)}
                />
              </Col>}
          </Row>
          <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
        </FieldItem>
      );
    })}
  </FieldContainer>
);

SecretsPanelForm.propTypes = {
  fields: PropTypes.object.isRequired,
  providerType: PropTypes.string.isRequired,
  secretFormValues: PropTypes.array,
  secrets: PropTypes.array,
};

SecretsPanelForm.defaultProps = {
  secrets: [],
  secretFormValues: [],
};

export default SecretsPanelForm;

import React from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'final-form';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { getLastFromSplit } from 'util/helpers/strings';
import { composeValidators, required, unixPattern } from 'util/forms';

const setSecretMountTypes = (provider) => {
  if (getLastFromSplit(provider.resource_type) === 'Kubernetes') {
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

const getMenuItems = (secrets, provider, type) => {
  const items = secrets.filter((p) => {
    let providerId;

    if (type === 'lambda' && provider.id && provider.properties && provider.properties.config && provider.properties.config.env) {
      providerId = provider.properties.config.env.public.META_COMPUTE_PROVIDER_ID;
    } else {
      const { id } = provider;

      providerId = id;
    }

    return p.id ? p.properties.provider.id === providerId : null;
  });

  return items.length ? items : [{ id: null, name: 'No Available Secrets' }];
};

const SecretsPanelForm = ({ type, fieldName, provider, secretsDropdown, formValues, form }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => (
      <FieldContainer>
        <AddButton label="Add Secret" onClick={() => fields.unshift({})} />
        {fields.map((member, index) => {
          const field = getIn(formValues, member) || {};

          const handleSecretNamePopulation = (value) => {
            const secret = secretsDropdown.find(i => i.id === value);
            if (value) {
              form.mutators.update(fieldName, index, { ...field, secret_id: value, secret_name: secret.name });
            }
          };

          const reset = (value) => {
            form.mutators.update(fieldName, index, { ...field, mount_type: value, secret_key: '', path: '' });
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
                    menuItems={setSecretMountTypes(provider)}
                    required
                    validate={composeValidators(required())}
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
                    menuItems={getMenuItems(secretsDropdown, provider, type)}
                    onChange={handleSecretNamePopulation}
                    async
                    validate={composeValidators(required())}
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
                      menuItems={getSecretKeys(field.secret_id, secretsDropdown)}
                      validate={composeValidators(required())}
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
                      validate={composeValidators(required(), field.mount_type === 'env' && unixPattern())}
                      helpText={getHelpText(field.mount_type)}
                    />
                  </Col>}
              </Row>
              <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
            </FieldItem>
          );
        })}
      </FieldContainer>
    )}
  </FieldArray>
);

SecretsPanelForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  provider: PropTypes.object,
  formValues: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  secretsDropdown: PropTypes.array,
  type: PropTypes.oneOf([
    'lambda', 'container'
  ])
};

SecretsPanelForm.defaultProps = {
  provider: {},
  type: 'container',
  secretsDropdown: [],
};

export default SecretsPanelForm;

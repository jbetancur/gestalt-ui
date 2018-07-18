import React from 'react';
import PropTypes from 'prop-types';
import { withPickerData } from 'Modules/MetaResource';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { getLastFromSplit } from 'util/helpers/strings';

const required = value => (value ? undefined : 'required');

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

const getMenuItems = (secrets, provider) => {
  const items = secrets.filter(p => p.properties && p.properties.provider && p.properties.provider.id === provider.id);

  return items.length ? items : [{ id: null, name: 'No Available Secrets' }];
};

const SecretsPanelForm = ({ fields, provider, secretsData, secretFormValues }) => (
  <FieldContainer>
    <AddButton label="Add Secret" onClick={() => fields.unshift({})} />
    {fields.map((member, index) => {
      const field = secretFormValues[index];
      const handleSecretNamePopulation = (dummy, secretId) => {
        const secret = secretsData.find(i => i.id === secretId);
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
                menuItems={setSecretMountTypes(provider)}
                required
              />
            </Col>
            {provider.id &&
              <Col flex={3} xs={12} sm={12}>
                <Field
                  id={`${member}.secret_id`}
                  name={`${member}.secret_id`}
                  component={SelectField}
                  label="Secret"
                  itemLabel="name"
                  itemValue="id"
                  required
                  menuItems={getMenuItems(secretsData, provider)}
                  onChange={handleSecretNamePopulation}
                  async
                  validate={[required]}
                />
              </Col>}
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
                menuItems={getSecretKeys(field.secret_id, secretsData)}
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
  provider: PropTypes.object.isRequired,
  secretFormValues: PropTypes.array,
  secretsData: PropTypes.array.isRequired,
};

SecretsPanelForm.defaultProps = {
  secretFormValues: [],
};

export default withPickerData({ entity: 'secrets', label: 'Secrets' })(SecretsPanelForm);

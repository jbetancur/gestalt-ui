import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Field } from 'react-final-form';
import { SelectField, TextField } from 'components/Form';
import { Panel } from 'components/Panels';
import { getLastFromSplit } from 'util/helpers/strings';
import SecretItemsForm from './SecretItemsForm';
import providerModel from '../../Providers/models/provider';

const SecretForm = ({ providers, values, form, editMode }) => {
  const filteredprovidersData = providers.filter(provider => getLastFromSplit(provider.resource_type) === 'Kubernetes' || providerModel.get(provider).properties.config.secret_support);
  const providersFiltered = filteredprovidersData.length > 0 ? filteredprovidersData : providers;
  const selectedProvider = Object.assign({}, providers.length ? providers.find(p => p.id === values.properties.provider.id) : {});
  const isMultiPartSecret = getLastFromSplit(selectedProvider.resource_type) === 'Kubernetes';
  const handleProviderChange = (e) => {
    form.change('properties.provider.id', e.target.value);
    form.change('properties.items', values.properties.items.slice(-1));
  };

  return (
    <React.Fragment>
      <Row gutter={5}>
        <Col flex={7} xs={12} sm={12} md={12}>
          <Panel expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  id="caas-provider"
                  component={SelectField}
                  name="properties.provider.id"
                  required
                  label="CaaS Provider"
                  itemLabel="name"
                  itemValue="id"
                  menuItems={providersFiltered}
                  disabled={editMode}
                  onChange={handleProviderChange}
                  async
                />
              </Col>
              <Col flex={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Secret Name"
                  type="text"
                  required
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={5} xs={12} sm={12} md={12}>
          <Panel expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  id="description"
                  component={TextField}
                  name="description"
                  label="Description"
                  multiline
                  rowsMax={6}
                />
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>

      <Row gutter={5}>
        {selectedProvider.id &&
        <Col flex={12}>
          <Panel title="Secret Items" noPadding expandable={false}>
            <SecretItemsForm
              fieldName="properties.items"
              disabled={editMode}
              multiPart={isMultiPartSecret}
              formValues={values}
              form={form}
            />
          </Panel>
        </Col>}
      </Row>
    </React.Fragment>
  );
};

SecretForm.propTypes = {
  providers: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
};

SecretForm.defaultProps = {
  editMode: false,
};

export default SecretForm;

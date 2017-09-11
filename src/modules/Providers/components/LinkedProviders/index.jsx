import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import FieldRemoveButton from 'components/Buttons/FieldRemoveButton';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';

const renderLinkedProviders = ({ fields, touched, error, fetchProviders, providersModel }) => (
  <div>
    <Button
      flat
      iconChildren="add"
      primary
      onClick={() => fields.unshift({})}
    >
      Linked Provider
    </Button>
    {touched && error}
    {fields.map((member, index) => (
      <div key={index} className="flex-row">
        <Field
          name={`${member}.name`}
          type="text"
          component={TextField}
          label="Prefix"
          className="flex-5"
          value=" " // fix for [object Object] on deselect
          required
        />
        <Field
          name={`${member}.id`}
          component={SelectField}
          label="Provider"
          className="flex-6"
          itemLabel="name"
          itemValue="id"
          required
          menuItems={providersModel}
          async
          onFocus={() => fetchProviders()}
        />
        <FieldRemoveButton onClick={() => fields.remove(index)} />
      </div>
    ))}
  </div>
);

renderLinkedProviders.propTypes = {
  fetchProviders: PropTypes.func.isRequired,
  providersModel: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
};

renderLinkedProviders.defaultProps = {
  touched: false,
  error: false,
};

const FieldArraysForm = props => (
  <FieldArray
    fetchProviders={props.fetchProviders}
    providersModel={props.providersModel}
    name="properties.linked_providers"
    component={renderLinkedProviders}
  />
);

FieldArraysForm.propTypes = {
  fetchProviders: PropTypes.func.isRequired,
  providersModel: PropTypes.array.isRequired,
};

export default FieldArraysForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, FormSection } from 'redux-form';
import FieldRemoveButton from 'components/Buttons/FieldRemoveButton';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';

const renderLinkedProviders = ({ fields, touched, error, fetchProviders, providersModel }) => (
  <FormSection name="">
    <Button
      flat
      primary
      label="Linked Provider"
      onClick={() => fields.push({})}
    >
      add
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
          className="flex-5"
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
  </FormSection>
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
    name="linkedProviders"
    component={renderLinkedProviders}
  />
);

FieldArraysForm.propTypes = {
  fetchProviders: PropTypes.func.isRequired,
  providersModel: PropTypes.array.isRequired,
};

export default FieldArraysForm;

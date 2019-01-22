import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { composeValidators, required } from 'util/forms';

const LinkedProviders = ({ fieldName, providers }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => (
      <FieldContainer>
        {fields.map((member, index) => (
          <FieldItem key={`linkedprovider-${member}`}>
            <Row gutter={5}>
              <Col flex={4} xs={12} sm={12}>
                <Field
                  name={`${member}.name`}
                  type="text"
                  component={TextField}
                  label="Prefix"
                  validate={composeValidators(required())}
                  required
                />
              </Col>
              <Col flex={8} xs={12} sm={12}>
                <Field
                  id={`${member}.id`}
                  name={`${member}.id`}
                  component={SelectField}
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  validate={composeValidators(required())}
                  required
                  async
                  menuItems={providers}
                />
              </Col>
            </Row>
            <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
          </FieldItem>
        ))}
        <Row gutter={5} center>
          <Col flex={12}>
            <AddButton label="Add Linked Provider" onClick={() => fields.push({})} />
          </Col>
        </Row>
      </FieldContainer>
    )}
  </FieldArray>
);

LinkedProviders.propTypes = {
  fieldName: PropTypes.string.isRequired,
  providers: PropTypes.array.isRequired,
};

export default LinkedProviders;

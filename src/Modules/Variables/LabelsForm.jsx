import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { isUnixVariable } from 'util/validations';
import { TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';

const validatePattern = value => (value && !isUnixVariable(value)) && 'Invalid Label Name';
const required = value => (value ? undefined : 'Required');

const LabelsForm = ({ fields }) => (
  <FieldContainer>
    <FieldItem>
      <AddButton label="Add Label" onAddItem={() => fields.push({})} />
    </FieldItem>
    {fields.map((member, index) => (
      <FieldItem key={`label-${member}`}>
        <Row gutter={5}>
          <Col flex={4} xs={12} sm={12}>
            <Field
              name={`${member}.name`}
              placeholder="name"
              type="text"
              component={TextField}
              validate={[validatePattern, required]}
              autoComplete="off"
            />
          </Col>
          <Col flex={8} xs={12} sm={12}>
            <Field
              name={`${member}.value`}
              placeholder="value"
              type="text"
              component={TextField}
              autoComplete="off"
            />
          </Col>
        </Row>
        <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
      </FieldItem>
    ))}
  </FieldContainer>
);

LabelsForm.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default LabelsForm;

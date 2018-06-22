import React from 'react';
import { Row, Col } from 'react-flexybox';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { TextField, SelectField } from 'components/ReduxFormFields';

const OutputsArray = () => (
  <FieldArray name="outputs">
    {({ fields }) => (
      <FieldContainer>
        <AddButton label="Add Output Feed" onClick={() => fields.push({})} />
        {fields.map((name, index) => (
          <FieldItem key={`variable-${name}`}>
            <Row gutter={5}>
              <Col flex={6}>
                <Field
                  name={`${name}.feed`}
                  label="Feed"
                  component={SelectField}
                  menuItems={['Odd Feed', 'Even Feed']}
                />
              </Col>

              <Col flex={6}>
                <Field
                  name={`${name}.name`}
                  label="Name"
                  component={TextField}
                />
              </Col>
            </Row>
            <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
          </FieldItem>
        ))}
      </FieldContainer>
    )}
  </FieldArray>
);

export default OutputsArray;

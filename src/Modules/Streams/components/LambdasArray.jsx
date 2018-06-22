import React from 'react';
import { Row, Col } from 'react-flexybox';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { SelectField } from 'components/ReduxFormFields';
import { Button } from 'react-md';

const LambdasArray = () => (
  <FieldArray name="lambdas">
    {({ fields }) => (
      <FieldContainer>
        <AddButton label="Add Lambda" onClick={() => fields.unshift({})} />
        {fields.map((name, index) => (
          <FieldItem key={`variable-${name}`}>
            <Row gutter={5}>
              <Col flex={6}>
                <Field
                  name={`${name}.lambda`}
                  label="Lambda"
                  component={SelectField}
                  menuItems={['Sweet Odd Even', 'Flatten', 'ParseInt']}
                />
              </Col>
              <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
              {index !== 0 && <Button icon primary onClick={() => fields.swap(index + 1, index - 1)}>arrow_upward</Button>}
              {index !== (fields.length - 1) && <Button icon primary onClick={() => fields.swap(index - 1, index + 1)}>arrow_downward</Button>}
            </Row>
          </FieldItem>
        ))}
      </FieldContainer>
    )}
  </FieldArray>
);

export default LambdasArray;

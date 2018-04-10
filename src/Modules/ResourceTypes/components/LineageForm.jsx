import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';

const LineageForm = ({ fields, resourceTypes, addLabel }) => (
  <FieldContainer>
    <FieldItem>
      <Button flat primary iconChildren="add" onClick={() => fields.unshift({})}>{addLabel}</Button>
    </FieldItem>
    {fields.map((member, index) => (
      <FieldItem key={member}>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id={`${member}`}
              name={`${member}`}
              component={SelectField}
              menuItems={resourceTypes}
              itemLabel="name"
              itemValue="id"
              label="Resource Type"
              async
            />
          </Col>
        </Row>
        <RemoveButton onRemove={fields.remove} fieldIndex={index} />
      </FieldItem>
    ))}
  </FieldContainer>
);

LineageForm.propTypes = {
  fields: PropTypes.object.isRequired,
  resourceTypes: PropTypes.array.isRequired,
  addLabel: PropTypes.string,
};

LineageForm.defaultProps = {
  addLabel: 'Add Type',
};

export default LineageForm;

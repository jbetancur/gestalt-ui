import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import FieldContainer from './FieldContainer';
import FieldItem from './FieldItem';
import RemoveButton from './RemoveButton';

const PropertyDefForm = ({ fields, resourceTypes }) => (
  <FieldContainer>
    <FieldItem>
      <Button flat primary iconChildren="add"onClick={() => fields.push({})}>Add Resource</Button>
    </FieldItem>
    {fields.map((member, index) => (
      <FieldItem key={index}>
        <RemoveButton onClick={() => fields.remove(index)} />
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
      </FieldItem>
    ))}
  </FieldContainer>
);

PropertyDefForm.propTypes = {
  fields: PropTypes.object.isRequired,
  resourceTypes: PropTypes.array.isRequired,
};

export default PropertyDefForm;

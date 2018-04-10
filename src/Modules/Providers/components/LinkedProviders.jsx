import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Field, FieldArray } from 'redux-form';
import { FieldRemoveButton, Button } from 'components/Buttons';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const renderLinkedProviders = ({ fields, touched, error, providersModel }) => (
  <Panel title="Linked Providers">
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
      <Row key={index} gutter={5}>
        <Col flex={5} xs={12}>
          <Field
            name={`${member}.name`}
            type="text"
            component={TextField}
            label="Prefix"
            value=" " // fix for [object Object] on deselect
            required
          />
        </Col>
        <Col flex={6} xs={12}>
          <Field
            id={`${member}.id`}
            name={`${member}.id`}
            component={SelectField}
            label="Provider"
            itemLabel="name"
            itemValue="id"
            required
            async
            menuItems={providersModel}
          />
        </Col>
        <FieldRemoveButton onClick={() => fields.remove(index)} />
      </Row>
    ))}
  </Panel>
);

renderLinkedProviders.propTypes = {
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
    providersModel={props.providersModel}
    name="properties.linked_providers"
    component={renderLinkedProviders}
  />
);

FieldArraysForm.propTypes = {
  providersModel: PropTypes.array.isRequired,
};

export default FieldArraysForm;

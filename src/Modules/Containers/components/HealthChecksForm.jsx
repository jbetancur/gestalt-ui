import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { getIn } from 'final-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField, Checkbox } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { fixInputNumber, composeValidators, required, min, max } from 'util/forms';
import healthCheckProtocols from '../lists/healthCheckProtocols';
import healthCheckPortTypes from '../lists/healthCheckPortTypes';

const initialValues = {
  protocol: 'HTTP',
  grace_period_seconds: 300,
  interval_seconds: 60,
  timeout_seconds: 20,
  max_consecutive_failures: 3,
  port_type: 'number' // this is stripped off when submitted
};

const HealthChecksForm = ({ fieldName, formValues }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => (
      <FieldContainer>
        <AddButton label="Add Health Check" onClick={() => fields.unshift(initialValues)} />
        {fields.map((member, index) => {
          const field = getIn(formValues, member) || {};
          const selectedHCProtocol = healthCheckProtocols.find(item => field.protocol === item.value);

          return (
            <FieldItem key={`healthcheck-${member}`}>
              <Row gutter={5}>
                <Col flex={3} xs={6} sm={6}>
                  <Field
                    id={`${member}.protocol`}
                    name={`${member}.protocol`}
                    component={SelectField}
                    label="Protocol"
                    itemLabel="displayName"
                    itemValue="value"
                    menuItems={healthCheckProtocols}
                    validate={composeValidators(required())}
                    deleteKeys={['supportsURL', 'supportsCMD', 'supportsPortType']}
                    required
                  />
                </Col>
                <Col flex={1} xs={6} sm={6}>
                  <Field
                    id={`${member}.grace_period_seconds`}
                    name={`${member}.grace_period_seconds`}
                    type="number"
                    min={1}
                    label="Grace Period"
                    component={TextField}
                    parse={fixInputNumber}
                    validate={composeValidators(required())}
                    required
                    helpText="seconds"
                  />
                </Col>
                <Col flex={1} xs={6} sm={6}>
                  <Field
                    id={`${member}.interval_seconds`}
                    name={`${member}.interval_seconds`}
                    type="number"
                    min={1}
                    label="Interval"
                    component={TextField}
                    parse={fixInputNumber}
                    validate={composeValidators(required())}
                    required
                    helpText="seconds"
                  />
                </Col>
                <Col flex={1} xs={6} sm={6}>
                  <Field
                    id={`${member}.timeout_seconds`}
                    name={`${member}.timeout_seconds`}
                    type="number"
                    min={1}
                    label="Timeout"
                    component={TextField}
                    parse={fixInputNumber}
                    validate={composeValidators(required(), min(1))}
                    required
                    helpText="seconds"
                  />
                </Col>
                <Col flex={2} xs={12} sm={6}>
                  <Field
                    id={`${member}.max_consecutive_failures`}
                    name={`${member}.max_consecutive_failures`}
                    type="number"
                    min={1}
                    label="Max Consecutive Failures"
                    component={TextField}
                    parse={fixInputNumber}
                    validate={composeValidators(required(), min(1))}
                    required
                  />
                </Col>
                {selectedHCProtocol && selectedHCProtocol.supportsPortType &&
                  <Col flex={2} xs={6} sm={6}>
                    <Field
                      id={`${member}.port_type`}
                      name={`${member}.port_type`}
                      component={SelectField}
                      label="Port Type"
                      itemLabel="displayName"
                      itemValue="value"
                      menuItems={healthCheckPortTypes}
                    />
                  </Col>}
                {field.port_type === 'number' && selectedHCProtocol && selectedHCProtocol.supportsPortType &&
                  <Col flex={1} xs={6} sm={6}>
                    <Field
                      id={`${member}.port`}
                      name={`${member}.port`}
                      type="number"
                      min={1}
                      max={65536}
                      label="Port Number"
                      component={TextField}
                      parse={fixInputNumber}
                      validate={composeValidators(required(), min(1), max(65536))}
                      required
                    />
                  </Col>}
                {field.port_type === 'index' && selectedHCProtocol && selectedHCProtocol.supportsPortType &&
                  <Col flex={1} xs={6} sm={6}>
                    <Field
                      id={`${member}.port_index`}
                      name={`${member}.port_index`}
                      type="number"
                      min={0}
                      max={65536}
                      label="Port Index"
                      component={TextField}
                      parse={fixInputNumber}
                      validate={composeValidators(required('required', true), min(0), max(65536))}
                      required
                    />
                  </Col>}
                {selectedHCProtocol && selectedHCProtocol.supportsURL &&
                  <Col flex={8} xs={12} sm={6}>
                    <Field
                      id={`${member}.path`}
                      name={`${member}.path`}
                      type="text"
                      label="URL Path"
                      component={TextField}
                      validate={composeValidators(required())}
                      required
                      helpText="absolute url path e.g. /"
                    />
                  </Col>}
                {selectedHCProtocol && selectedHCProtocol.supportsCMD &&
                  <Col flex={4} xs={12} sm={6}>
                    <Field
                      id={`${member}.command`}
                      name={`${member}.command`}
                      type="text"
                      label="Command"
                      component={TextField}
                      validate={composeValidators(required())}
                      required
                    />
                  </Col>}
                {selectedHCProtocol && selectedHCProtocol.supportsURL &&
                <Col flex={4} xs={12} sm={6}>
                  <Field
                    id={`${member}.ignore_http_1xx`}
                    name={`${member}.ignore_http_1xx`}
                    component={Checkbox}
                    // TODO: Find out why redux-form state for bool doesn't apply
                    checked={field.ignore_http_1xx}
                    label="Ignore HTTP 100-199"
                  />
                </Col>}
              </Row>
              <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
            </FieldItem>
          );
        })}
      </FieldContainer>
    )}
  </FieldArray>
);

HealthChecksForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default HealthChecksForm;

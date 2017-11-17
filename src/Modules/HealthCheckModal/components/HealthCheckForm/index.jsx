import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexybox';
import { Field, getFormValues } from 'redux-form';
import { Checkbox, SelectField, TextField } from 'components/ReduxFormFields';
import { ModalFooter } from 'components/Modal';
import { Button } from 'components/Buttons';
import healthCheckProtocols from '../../lists/healthCheckProtocols';
import healthCheckPortTypes from '../../lists/healthCheckPortTypes';

const fixInputNumber = value => value && parseInt(value, 10);
const HealthCheckForm = (props) => {
  const {
    values,
    reset,
    change,
    hideHealthCheckModal
  } = props;

  const selectedHCProtocol = healthCheckProtocols.find(item => values.protocol === item.value);

  const close = () => {
    reset();
    hideHealthCheckModal();
  };

  const clearPorts = () => {
    change('port_index', '');
    change('port', '');
  };

  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
      <Row gutter={5}>
        <Col flex={2} xs={6} sm={6}>
          <Field
            name="protocol"
            component={SelectField}
            label="Protocol"
            itemLabel="displayName"
            itemValue="value"
            menuItems={healthCheckProtocols}
            onChange={() => reset()}
            required
          />
        </Col>
        <Col flex={2} xs={6} sm={6}>
          <Field
            name="grace_period_seconds"
            type="number"
            min={1}
            label="Grace Period"
            component={TextField}
            normalize={fixInputNumber}
            required
            helpText="seconds"
          />
        </Col>
        <Col flex={2} xs={6} sm={6}>
          <Field
            name="interval_seconds"
            type="number"
            min={1}
            label="Interval"
            component={TextField}
            normalize={fixInputNumber}
            required
            helpText="seconds"
          />
        </Col>
        <Col flex={2} xs={6} sm={6}>
          <Field
            name="timeout_seconds"
            type="number"
            min={1}
            label="Timeout"
            component={TextField}
            normalize={fixInputNumber}
            required
            helpText="seconds"
          />
        </Col>
        <Col flex={2} xs={6} sm={6}>
          <Field
            name="max_consecutive_failures"
            type="number"
            min={1}
            label="Max Consecutive Failures"
            component={TextField}
            normalize={fixInputNumber}
            required
          />
        </Col>
      </Row>
      <Row gutter={5}>
        {selectedHCProtocol && selectedHCProtocol.supportsPortType &&
          <Col flex={3} xs={6} sm={6}>
            <Field
              name="port_type"
              component={SelectField}
              label="Port Type"
              itemLabel="displayName"
              itemValue="value"
              menuItems={healthCheckPortTypes}
              onChange={clearPorts}
            />
          </Col>}
        {values.port_type === 'number' && selectedHCProtocol && selectedHCProtocol.supportsPortType &&
          <Col flex={2} xs={6} sm={6}>
            <Field
              name="port"
              type="number"
              min={0}
              max={65535}
              label="Port Number"
              component={TextField}
              normalize={fixInputNumber}
              required
            />
          </Col>}
        {values.port_type === 'index' && selectedHCProtocol && selectedHCProtocol.supportsPortType &&
          <Col flex={2} xs={6} sm={6}>
            <Field
              name="port_index"
              type="number"
              min={0}
              max={65535}
              label="Port Index"
              component={TextField}
              parse={value => Number(value)}
              required
            />
          </Col>}
        {selectedHCProtocol && selectedHCProtocol.supportsURL &&
          <Col flex>
            <Field
              name="path"
              type="text"
              label="Path"
              component={TextField}
              required
            />
          </Col>}
        {selectedHCProtocol && selectedHCProtocol.supportsCMD &&
          <Col flex>
            <Field
              name="command"
              type="text"
              label="Command"
              className="flex"
              component={TextField}
              required
            />
          </Col>}
        {selectedHCProtocol && selectedHCProtocol.supportsURL &&
          <Field
            id="ignore-http-codes"
            component={Checkbox}
            name="ignore_http_1xx"
            // TODO: Find out why redux-form state for bool doesn't apply
            checked={values.ignore_http_1xx}
            label="Ignore Codes 100-199"
          />}
      </Row>
      <ModalFooter>
        <Button
          flat
          onClick={close}
          Cancel
        >
          Cancel
        </Button>
        <Button
          flat
          type="submit"
          disabled={props.pristine || props.invalid || props.submitting}
          primary
        >
          Add Health Check
        </Button>
      </ModalFooter>
    </form>
  );
};

HealthCheckForm.propTypes = {
  hideHealthCheckModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(HealthCheckForm);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { ModalFooter } from 'components/Modal';
import Checkbox from 'components/Checkbox';
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
      <div className="flex-row">
        <div className="flex-row">
          <Field
            name="protocol"
            className="flex-2 flex-xs-6 flex-sm-6"
            component={SelectField}
            label="Protocol"
            itemLabel="displayName"
            itemValue="value"
            menuItems={healthCheckProtocols}
            onChange={() => reset()}
            required
          />
          <Field
            name="grace_period_seconds"
            type="number"
            min={1}
            label="Grace Period"
            className="flex-2 flex-xs-6 flex-sm-6"
            component={TextField}
            normalize={fixInputNumber}
            required
            helpText="seconds"
          />
          <Field
            name="interval_seconds"
            type="number"
            min={1}
            label="Interval"
            className="flex-2 flex-xs-6 flex-sm-6"
            component={TextField}
            normalize={fixInputNumber}
            required
            helpText="seconds"
          />
          <Field
            name="timeout_seconds"
            type="number"
            min={1}
            label="Timeout"
            className="flex-2 flex-xs-6 flex-sm-6"
            component={TextField}
            normalize={fixInputNumber}
            required
            helpText="seconds"
          />
          <Field
            name="max_consecutive_failures"
            type="number"
            min={1}
            label="Max Consecutive Failures"
            className="flex-2 flex-xs-6 flex-sm-6"
            component={TextField}
            normalize={fixInputNumber}
            required
          />
        </div>
        <div className="flex-row">
          {selectedHCProtocol && selectedHCProtocol.supportsPortType ?
            <Field
              name="port_type"
              className="flex-3 flex-xs-6 flex-sm-6"
              component={SelectField}
              label="Port Type"
              itemLabel="displayName"
              itemValue="value"
              menuItems={healthCheckPortTypes}
              onChange={() => clearPorts()}
            /> : null}
          {values.port_type === 'number' && selectedHCProtocol && selectedHCProtocol.supportsPortType ?
            <Field
              name="port"
              type="number"
              min={0}
              max={65535}
              label="Port Number"
              className="flex-2 flex-xs-6 flex-sm-6"
              component={TextField}
              normalize={fixInputNumber}
              required
            /> : null}
          {values.port_type === 'index' && selectedHCProtocol && selectedHCProtocol.supportsPortType ?
            <Field
              name="port_index"
              type="number"
              min={0}
              max={65535}
              label="Port Index"
              className="flex-2 flex-xs-6 flex-sm-6"
              component={TextField}
              parse={value => Number(value)}
              required
            /> : null}
          {selectedHCProtocol && selectedHCProtocol.supportsURL ?
            <Field
              name="path"
              type="text"
              label="Path"
              className="flex"
              component={TextField}
              required
            /> : null}
          {selectedHCProtocol && selectedHCProtocol.supportsCMD ?
            <Field
              name="command"
              type="text"
              label="Command"
              className="flex"
              component={TextField}
              required
            /> : null}
          {selectedHCProtocol && selectedHCProtocol.supportsURL ?
            <Field
              id="ignore-http-codes"
              component={Checkbox}
              name="ignore_http_1xx"
              // TODO: Find out why redux-form state for bool doesn't apply
              checked={values.ignore_http_1xx}
              label="Ignore Codes 100-199"
            /> : null}
        </div>
      </div>
      <ModalFooter>
        <Button
          flat
          onClick={() => close()}
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

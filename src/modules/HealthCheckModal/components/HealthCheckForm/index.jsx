import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { ModalFooter } from 'components/Modal';
import Checkbox from 'components/Checkbox';
import healthCheckProtocols from '../../lists/healthCheckProtocols';
import healthCheckPortTypes from '../../lists/healthCheckPortTypes';

const HealthCheckForm = (props) => {
  const { values, reset, change } = props;

  const selectedHCProtocol = healthCheckProtocols.find(item => values.protocol === item.value);

  const close = () => {
    props.reset();
    props.hideHealthCheckModal();
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
            lineDirection="center"
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
            errorText={props.touched && props.error}
            lineDirection="center"
            parse={value => Number(value)}  // redux form formats everything as string, so force number
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
            errorText={props.touched && props.error}
            lineDirection="center"
            parse={value => Number(value)}  // redux form formats everything as string, so force number
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
            errorText={props.touched && props.error}
            lineDirection="center"
            parse={value => Number(value)}  // redux form formats everything as string, so force number
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
            errorText={props.touched && props.error}
            lineDirection="center"
            parse={value => Number(value)}  // redux form formats everything as string, so force number
            required
          />
        </div>
        <div className="flex-row">
          {selectedHCProtocol && selectedHCProtocol.supportsPortType ?
            <Field
              name="port_type"
              className="flex-3 flex-xs-6 flex-sm-6"
              component={SelectField}
              lineDirection="center"
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
              min={1}
              label="Port Number"
              className="flex-2 flex-xs-6 flex-sm-6"
              component={TextField}
              errorText={props.touched && props.error}
              lineDirection="center"
              parse={value => Number(value)}  // redux form formats everything as string, so force number
              required
            /> : null}
          {values.port_type === 'index' && selectedHCProtocol && selectedHCProtocol.supportsPortType ?
            <Field
              name="port_index"
              type="number"
              min={1}
              label="Port Index"
              className="flex-2 flex-xs-6 flex-sm-6"
              component={TextField}
              errorText={props.touched && props.error}
              lineDirection="center"
              parse={value => Number(value)}  // redux form formats everything as string, so force number
              required
            /> : null}
          {selectedHCProtocol && selectedHCProtocol.supportsURL ?
            <Field
              name="path"
              type="text"
              label="Path"
              className="flex"
              component={TextField}
              errorText={props.touched && props.error}
              lineDirection="center"
              required
            /> : null}
          {selectedHCProtocol && selectedHCProtocol.supportsCMD ?
            <Field
              name="command"
              type="text"
              label="Command"
              className="flex"
              component={TextField}
              errorText={props.touched && props.error}
              lineDirection="center"
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
          label="Cancel"
          onClick={() => close()}
        />
        <Button
          flat
          label="Add Health Check"
          type="submit"
          disabled={props.pristine || props.invalid || props.submitting}
          primary
        />
      </ModalFooter>
    </form>
  );
};

HealthCheckForm.propTypes = {
  // hideHealthCheckModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
};

HealthCheckForm.defaultProps = {
  touched: false,
  error: false,
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(HealthCheckForm);

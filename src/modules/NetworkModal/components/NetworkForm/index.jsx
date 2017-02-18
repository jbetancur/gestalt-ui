import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import Checkbox from 'components/Checkbox';
import { ModalFooter } from 'components/Modal';
import networkProtocols from '../../lists/networkProtocols';

const NetworkForm = (props) => {
  const { values } = props;

  const close = () => {
    props.reset();
    props.hideNetworkModal();
  };

  return (
    <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off" style={{ marginTop: '-.5em' }}>
      <Field
        id="expose-service"
        component={Checkbox}
        name="expose_endpoint"
        // TODO: Find out why redux-form state for bool doesn't apply
        checked={values.expose_endpoint}
        label="Expose Service"
      />
      <div className="flex-row" style={{ marginTop: '-1.4em' }}>
        <Field
          name="name"
          type="text"
          label="Name"
          className="flex-6 flex-xs-6"
          component={TextField}
          errorText={props.touched && props.error}
          lineDirection="center"
          required
        />
        <Field
          name="protocol"
          className="flex-3 flex-xs-6"
          component={SelectField}
          lineDirection="center"
          label="Protocol"
          itemLabel="displayName"
          itemValue="value"
          menuItems={networkProtocols}
          required
        />
        {values.expose_endpoint && props.networkType === 'HOST' ?
          <Field
            name="service_port"
            type="number"
            min={0}
            max={65536}
            label="Service Port"
            className="flex-3 flex-xs-6"
            component={TextField}
            errorText={props.touched && props.error}
            lineDirection="center"
            required
            parse={value => Number(value)}  // redux form formats everything as string, so force number
          /> : null}
        {props.networkType === 'BRIDGE' ?
          <Field
            name="container_port"
            type="number"
            min={0}
            max={65536}
            label="Container Port"
            className="flex-3 flex-xs-6"
            component={TextField}
            errorText={props.touched && props.error}
            lineDirection="center"
            required
            parse={value => Number(value)}  // redux form formats everything as string, so force number
          /> : null}
      </div>
      <ModalFooter>
        <Button
          flat
          label="Cancel"
          onClick={() => close()}
        />
        <Button
          flat
          label="Add Port Mapping"
          type="submit"
          disabled={props.pristine || props.invalid || props.submitting}
          primary
        />
      </ModalFooter>
    </form>
  );
};

NetworkForm.propTypes = {
  hideNetworkModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  networkType: PropTypes.string.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
};

NetworkForm.defaultProps = {
  touched: false,
  error: false,
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(NetworkForm);

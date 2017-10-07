import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row } from 'react-flexybox';
import { Field, getFormValues } from 'redux-form';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { ModalFooter } from 'components/Modal';
import volumeTypes from '../../lists/volumeTypes';

// const fixInputNumber = value => value && parseInt(value, 10);
const VolumeForm = (props) => {
  const { providerType, values, reset } = props;
  const selectedVolumeType = volumeTypes[providerType].find(type => values.type === type.type);
  const close = () => {
    props.reset();
    props.hideVolumeModal();
  };

  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
      <Row gutter={5}>
        <Field
          name="type"
          className="flex-2 flex-xs-12 flex-sm-6"
          component={SelectField}
          label="Type"
          itemLabel="displayName"
          itemValue="type"
          menuItems={volumeTypes[providerType]}
          onChange={() => reset()}
          required
        />
        {selectedVolumeType &&
          <Field
            name="mode"
            className="flex-3 flex-xs-12 flex-sm-6"
            component={SelectField}
            label="Mode"
            itemLabel="displayName"
            itemValue="mode"
            menuItems={selectedVolumeType.modes}
            required
          />}
        {values.type === 'persistent' ?
          <Field
            name="persistent.size"
            type="number"
            min={1}
            label="Size (MiB)"
            className="flex-2 flex-xs-12"
            component={TextField}
            parse={value => Number(value)} // redux form formats everything as string, so force number
            required
          /> :
          <Field
            name="host_path"
            type="text"
            label="Host Path"
            className="flex-4 flex-xs-12 flex-sm-12"
            component={TextField}
            helpText="absolute directory path"
            required
          />}
        <Field
          name="container_path"
          type="text"
          label="Container Path"
          className="flex flex-sm-12"
          component={TextField}
          helpText="directory path"
          required
        />
      </Row>

      {providerType === 'Kubernetes' &&
        <Row gutter={5}>
          <Field
            name="name"
            type="text"
            label="Volume Name"
            className="flex-6 flex-xs-12 flex-sm-12"
            component={TextField}
            helpText="The name is used to identify the volume to attach to the container"
            required
          />
        </Row>}
      <ModalFooter>
        <Button
          flat
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          flat
          type="submit"
          disabled={props.pristine || props.invalid || props.submitting}
          primary
        >
          Add Volume
        </Button>
      </ModalFooter>
    </form>
  );
};

VolumeForm.propTypes = {
  hideVolumeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  providerType: PropTypes.string,
};

VolumeForm.defaultProps = {
  providerType: 'default',
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(VolumeForm);

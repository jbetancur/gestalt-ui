import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { ModalFooter } from 'components/Modal';
import volumeTypes from '../../lists/volumeTypes';

const VolumeForm = (props) => {
  const { values, reset } = props;

  const selectedVolumeType = volumeTypes.find(type => values.type === type.type);

  const close = () => {
    props.reset();
    props.hideVolumeModal();
  };

  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
      <div className="flex-row">
        <Field
          name="type"
          className="flex-2 flex-xs-6 flex-sm-6"
          component={SelectField}
          label="Type"
          itemLabel="type"
          itemValue="type"
          menuItems={volumeTypes}
          onChange={() => reset()}
          required
        />
        {!selectedVolumeType ? null : <Field
          name="mode"
          className="flex-2 flex-xs-6 flex-sm-6"
          component={SelectField}
          label="Mode"
          itemLabel="displayName"
          itemValue="mode"
          menuItems={selectedVolumeType.modes}
          required
        />}
        {values.type === 'Persistent' ?
          <Field
            name="persistent.size"
            type="number"
            min={1}
            label="Size (MiB)"
            className="flex-2 flex-xs-12"
            component={TextField}
            parse={value => Number(value)}  // redux form formats everything as string, so force number
            required
          /> :
          <Field
            name="host_path"
            type="text"
            label="Host Path"
            className="flex-4 flex-xs-12 flex-sm-12"
            component={TextField}
            helpText="absolute path (/dir)"
            required
          />}
        <Field
          name="container_path"
          type="text"
          label="Container Path"
          className="flex flex-sm-12"
          component={TextField}
          helpText="relative path (dir)"
          required
        />
      </div>
      <ModalFooter>
        <Button
          flat
          label="Cancel"
          onClick={() => close()}
        />
        <Button
          flat
          label="Add Volume"
          type="submit"
          disabled={props.pristine || props.invalid || props.submitting}
          primary
        />
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
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(VolumeForm);

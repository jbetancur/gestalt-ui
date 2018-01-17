import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';

const ActionVerbsForm = ({ fields, addLabel }) => (
  <FieldContainer>
    <FieldItem>
      <Button flat primary iconChildren="add" onClick={() => fields.push()}>{addLabel}</Button>
    </FieldItem>
    {fields.map((member, index) => (
      <FieldItem key={index}>
        <RemoveButton onRemove={fields.remove} index={index} />
        <Field
          name={`${member}`}
          type="text"
          component={TextField}
          label="Verb"
        />
      </FieldItem>
    ))}
  </FieldContainer>
);

ActionVerbsForm.propTypes = {
  fields: PropTypes.object.isRequired,
  addLabel: PropTypes.string,
};

ActionVerbsForm.defaultProps = {
  addLabel: 'Add Verb',
};

export default ActionVerbsForm;

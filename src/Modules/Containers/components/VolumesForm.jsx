import React from 'react';
import PropTypes from 'prop-types';
import { withPickerData } from 'Modules/MetaResource';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { isURL } from 'validator';
import { composeValidators, required, validator } from 'util/forms';

const VolumesForm = ({ fieldName, providerId, volumesData }) => {
  const volumes = volumesData.filter(p => p.properties.provider.id === providerId);

  return (
    <FieldArray name={fieldName}>
      {({ fields }) => (
        <FieldContainer>
          <AddButton label="Add Volume" onClick={() => fields.unshift({})} />
          {fields.map((member, index) => (
            <FieldItem key={`volume-${member}`}>
              <Row gutter={5}>
                <Col flex={4} xs={12} sm={12}>
                  <Field
                    id={`${member}.volume_id`}
                    name={`${member}.volume_id`}
                    component={SelectField}
                    label="Volume"
                    itemLabel="name"
                    itemValue="id"
                    menuItems={volumes.length ? volumes : [{ id: null, name: 'No Available Volumes' }]}
                    validate={composeValidators(required())}
                    required
                  />
                </Col>
                <Col flex={8} xs={12} sm={12}>
                  <Field
                    name={`${member}.mount_path`}
                    type="text"
                    component={TextField}
                    label="Mount Path"
                    validate={
                      composeValidators(
                        required(),
                        validator(isURL, 'must be a relative URL path', { require_protocol: false, require_host: false, allow_trailing_dot: false })
                      )}
                    required
                  />
                </Col>
              </Row>
              <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
            </FieldItem>
          ))}
        </FieldContainer>
      )}
    </FieldArray>
  );
};

VolumesForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  providerId: PropTypes.string.isRequired,
  volumesData: PropTypes.array.isRequired,
};

export default withPickerData({ entity: 'volumes', label: 'Volumes' })(VolumesForm);

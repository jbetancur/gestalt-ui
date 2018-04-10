import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { isURL } from 'validator';
import volumeTypes from '../lists/volumeTypes';

const validateContainerPathDCOS = value => value && (value.charAt(0) === '/') && 'the path must be relative';
const validateContainerPath = value => value && !isURL(value, { require_protocol: false, require_host: false, require_valid_protocol: false }) && 'the path must be absolute';
const initialValues = {
  type: 'persistent',
};

const VolumesForm = ({ fields, providerType }) => (
  <FieldContainer>
    <FieldItem>
      <AddButton label="Add Volume" onAddItem={() => fields.unshift(initialValues)} />
    </FieldItem>
    {fields.map((member, index) => {
      const field = fields.get(index);
      const selectedVolumeType = volumeTypes[providerType] && volumeTypes[providerType].find(type => field.type === type.type);

      return (
        <FieldItem key={`volume-${member}`}>
          <Row>
            <Row gutter={5}>
              <Col flex={2} xs={12} sm={12}>
                <Field
                  id={`${member}.type`}
                  name={`${member}.type`}
                  component={SelectField}
                  label="Type"
                  itemLabel="displayName"
                  itemValue="type"
                  menuItems={volumeTypes[providerType]}
                  required
                />
              </Col>
              {selectedVolumeType &&
                <Col flex={3} xs={12} sm={12}>
                  <Field
                    id={`${member}.mode`}
                    name={`${member}.mode`}
                    component={SelectField}
                    label="Mode"
                    itemLabel="displayName"
                    itemValue="mode"
                    menuItems={selectedVolumeType.modes}
                    required
                  />
                </Col>}
              {field.type === 'persistent' ?
                <Col flex={2} xs={6} sm={6}>
                  <Field
                    name={`${member}.persistent.size`}
                    type="number"
                    min={1}
                    label="Size (MiB)"
                    component={TextField}
                    parse={value => Number(value)} // redux form formats everything as string, so force number
                    required
                  />
                </Col> :
                <Col flex={4} xs={12} sm={12}>
                  <Field
                    name={`${member}.host_path`}
                    type="text"
                    label="Host Path"
                    component={TextField}
                    helpText="absolute directory path"
                    required
                  />
                </Col>}
              <Col flex sm={12} xs={12}>
                <Field
                  name={`${member}.container_path`}
                  type="text"
                  label="Container Path"
                  component={TextField}
                  helpText="directory path"
                  required
                  validate={[providerType === 'DCOS' ? validateContainerPathDCOS : validateContainerPath]}
                />
              </Col>
            </Row>

            {providerType === 'Kubernetes' &&
              <Row gutter={5}>
                <Col flex={6} xs={12} sm={12}>
                  <Field
                    name={`${member}.name`}
                    type="text"
                    label="Volume Name"
                    component={TextField}
                    helpText="The name is used to identify the volume to attach to the container"
                    required={field.type === 'persistent'}
                  />
                </Col>
              </Row>}
          </Row>
          <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
        </FieldItem>
      );
    })}
  </FieldContainer>
);

VolumesForm.propTypes = {
  fields: PropTypes.object.isRequired,
  providerType: PropTypes.string,
};

VolumesForm.defaultProps = {
  providerType: '',
};

export default VolumesForm;

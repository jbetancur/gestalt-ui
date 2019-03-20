import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Field } from 'react-final-form';
import { TextField } from 'components/Form';
import { Panel } from 'components/Panels';
import { formatName, composeValidators, required } from 'util/forms';
import SelectedProvider from './SelectedProvider';
import VolumeConfigSection from './VolumeConfigSection';

const resetFields = [{ field: 'properties.type', value: '' }, { field: 'properties.config', value: {} }];

const VolumeForm = ({ form, values, selectedProvider, editMode }) => (
  <React.Fragment>
    <Row gutter={5}>
      {!editMode &&
        <Col flex={7} xs={12} sm={12} md={12}>
          <Panel expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <SelectedProvider
                  label="CaaS Provider"
                  form={form}
                  resetFields={resetFields}
                />
              </Col>
              <Col flex={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Volume Name"
                  type="text"
                  parse={formatName}
                  helpText="alphanumeric and dashes are allowed"
                  validate={composeValidators(required('a volume name is required'))}
                  required
                />
              </Col>
            </Row>
          </Panel>
        </Col>}

      <Col flex>
        <Panel expandable={false} fill>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                id="description"
                component={TextField}
                name="description"
                label="Description"
                multiline
                rowsMax={6}
              />
            </Col>
          </Row>
        </Panel>
      </Col>
    </Row>

    {(selectedProvider.isSelected || editMode) &&
      <Row gutter={5}>
        <Col flex={12}>
          <Panel title="Configuration" expandable={false} fill>
            <VolumeConfigSection
              formValues={values}
              form={form}
              selectedProvider={selectedProvider}
              editMode={editMode}
            />
          </Panel>
        </Col>
      </Row>}
  </React.Fragment>
);

VolumeForm.propTypes = {
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  selectedProvider: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
};

VolumeForm.defaultProps = {
  editMode: false,
};

export default VolumeForm;

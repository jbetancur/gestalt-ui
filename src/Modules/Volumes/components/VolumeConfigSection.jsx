import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import RadioGroup from 'components/Fields/RadioGroup';
import { SelectField, TextField, AceEditor } from 'components/Form';
import { fixInputNumber, composeValidators, required, validator } from 'util/forms';
import { isYAML } from 'util/validations';
import { isURL } from 'validator';
import { volumeTypes, accessTypes, sizeUnits } from '../constants';

class VolumeConfigSection extends Component {
  static propTypes = {
    selectedProvider: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    formValues: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    editMode: false,
  };

  renderConfig() {
    const { formValues, selectedProvider, editMode } = this.props;
    switch (formValues.properties.type) {
      case 'dynamic':
        return (
          <Col flex>
            <Field
              id="storage_class-selection"
              component={SelectField}
              name="properties.config.storage_class"
              label="Storage Class"
              menuItems={(
                editMode
                  ? [formValues.properties.config.storage_class]
                  : selectedProvider.provider.properties.config.storage_classes
              )}
              required
              validate={composeValidators(required())}
              disabled={editMode}
            />
          </Col>
        );
      case 'host_path':
        return (
          <Col flex>
            <Field
              component={TextField}
              name="properties.config.host_path"
              label="Host Path"
              type="text"
              required
              disabled={editMode}
              helpText="e.g. /mypath"
              validate={
                composeValidators(
                  required('a host path is required'),
                  validator(isURL, 'must be a relative URL path', { require_protocol: false, require_host: false, allow_trailing_dot: false })
                )
              }
            />
          </Col>
        );
      case 'external':
        return (
          <Col flex={12}>
            <Field
              // properties.yaml is a temp placeholder for yaml that wil be converted to config{}
              name="properties.yaml"
              component={AceEditor}
              maxLines={15}
              minLines={15}
              mode="yaml"
              theme="dracula"
              readOnly={editMode}
              validate={
                composeValidators(
                  validator(isYAML, 'invalid YAML')
                )
              }
            />
          </Col>
        );
      default:
        return null;
    }
  }

  render() {
    const { form, formValues, selectedProvider, editMode } = this.props;
    const menuItems = editMode
      ? [{ type: formValues.properties.type || '' }]
      : volumeTypes.filter(v => v.supported.some(p => p === selectedProvider.type));

    return (
      <Row gutter={5}>
        <Col flex={2} xs={12}>
          <Field
            id="type-selection"
            component={SelectField}
            name="properties.type"
            label="Volume Type"
            itemLabel="type"
            itemValue="type"
            menuItems={menuItems}
            validate={composeValidators(required())}
            required
            disabled={editMode}
          />
        </Col>

        <Col flex={2} xs={6}>
          <Field
            component={TextField}
            name="properties.size"
            label="Size"
            type="number"
            format={fixInputNumber}
            inputProps={{
              min: 1,
              step: 1,
            }}
            validate={composeValidators(required())}
            required
            disabled={editMode}
          />
        </Col>

        <Col flex={1} xs={6}>
          <Field
            id="size_unit-selection"
            component={SelectField}
            name="properties.size_unit"
            label="Unit"
            menuItems={sizeUnits}
            disabled={editMode}
          />
        </Col>

        {this.renderConfig()}

        <Col flex={12}>
          <RadioGroup
            id="accessmode-selection"
            name="properties.access_mode"
            inline
            noPadding
            label="Access Mode"
            controls={accessTypes}
            defaultValue={formValues.properties.access_mode}
            disabled={editMode}
            onChange={value => form.change('properties.access_mode', value)}
          />
        </Col>
      </Row>
    );
  }
}

export default VolumeConfigSection;

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { Caption } from 'components/Typography';
import { AceEditor, SelectField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { FileInput } from 'react-md';
import { isYAML } from 'util/validations';
import { isJSON } from 'validator';
import { composeValidators, validator, required } from 'util/forms';

const DataEditor = ({ title, editMode, editorMode, subTypes, form }) => {
  const onFile = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      const prop = editMode ? 'properties.tempData' : 'properties.data';
      form.change(prop, reader.result);
    };

    reader.readAsText(file);
  };

  return (
    <Panel title={title} expandable={false} noPadding>
      <Row gutter={5}>
        <Col flex={12}>
          <Row gutter={16}>
            <Col flex={6}>
              <Field
                id={`${title}-subtype`}
                component={SelectField}
                name="properties.provider_subtype"
                menuItems={subTypes}
                label="Sub Type"
                validate={composeValidators(required('a provider sub type is required'))}
              />
            </Col>
          </Row>

          <FileInput
            id={`${title}-${editorMode}-config`}
            label={`Upload ${editorMode}`}
            onChange={onFile}
            primary
          />
          {editMode &&
          <Row center gutter={16}>
            <Col flex={12}>
              <Caption large>
                {`The ${editorMode.toUpperCase()} configuration is not displayed for security reasons, however, you may update it by entering in a new configuration`}
              </Caption>
            </Col>
          </Row>}
        </Col>
      </Row>

      <Field
        component={AceEditor}
        mode={editorMode}
        theme="dracula"
        // tempData allows us to not display the config (temp security workaround) but allows us to deal with it as a PATH op in provider model
        name={editMode ? 'properties.tempData' : 'properties.data'}
        maxLines={50}
        minLines={15}
        fontSize={12}
        validate={composeValidators(
          validator(editorMode === 'yaml' ? isYAML : isJSON, `invalid ${editorMode}`)
        )}
      />
    </Panel>
  );
};

DataEditor.propTypes = {
  title: PropTypes.string,
  editorMode: PropTypes.string,
  subTypes: PropTypes.array,
  form: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
};

DataEditor.defaultProps = {
  title: 'Configuration',
  editorMode: 'yaml',
  subTypes: [],
  editMode: false,
};

export default DataEditor;

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { AceEditor } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { FileInput } from 'react-md';
import { isYAML } from 'util/validations';
import { composeValidators, required, validator } from 'util/forms';

const KubeEditorSection = ({ dispatch, change }) => {
  const onFile = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      dispatch(change('properties.data', reader.result));
    };

    reader.readAsText(file);
  };

  return (
    <Panel title="Kubernetes Configuration" expandable={false} noPadding>
      <Row gutter={5}>
        <Col flex={12}>
          <FileInput
            id="imageInput1"
            label="Upload YAML"
            onChange={onFile}
            accept="application/x-yaml" // The IANA MIME types registry doesn't list YAML yet, so there isn't a correct one, per se.
            primary
          />
        </Col>
      </Row>

      <Field
        component={AceEditor}
        mode="yaml"
        theme="dracula"
        name="properties.data"
        maxLines={50}
        minLines={15}
        fontSize={12}
        validate={composeValidators(
          required('yaml config is required'),
          validator(isYAML, 'invalid yaml')
        )}
      />
    </Panel>
  );
};

KubeEditorSection.propTypes = {
  dispatch: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
};

export default KubeEditorSection;

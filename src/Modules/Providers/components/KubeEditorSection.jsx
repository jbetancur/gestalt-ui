import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import AceEditor from 'components/AceEditor';
import { FileInput } from 'react-md';

const KubeEditorSection = (props) => {
  const onFile = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      props.dispatch(props.change('properties.data', reader.result));
    };

    reader.readAsText(file);
  };

  return (
    <Row>
      <FileInput
        id="imageInput1"
        label="Upload YAML"
        onChange={onFile}
        accept="application/x-yaml" // The IANA MIME types registry doesn't list YAML yet, so there isn't a correct one, per se.
        primary
      />
      <Row gutter={5}>
        <Col flex={12}>
          <Field
            component={AceEditor}
            mode="yaml"
            theme="chrome"
            name="properties.data"
            maxLines={50}
            minLines={15}
            fontSize={12}
          />
        </Col>
      </Row>
    </Row>
  );
};

KubeEditorSection.propTypes = {};

export default KubeEditorSection;

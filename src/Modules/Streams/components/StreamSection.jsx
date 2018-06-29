import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const StreamSection = ({ providers, editMode }) => (
  <Row gutter={5}>
    <Col flex={8} xs={12} sm={12}>
      <Panel title="General" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="stream-provider"
              name={`${editMode ? 'properties.provider.id' : 'properties.provider'}`}
              label="Stream Provider"
              component={SelectField}
              menuItems={providers}
              itemLabel="name"
              itemValue="id"
              helpText="Select a stream provider"
              async
              required
              disabled={editMode}
            />
          </Col>
          <Col flex={12}>
            <Field
              id="name"
              component={TextField}
              name="name"
              label="Stream Name"
              required
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={4} xs={12} sm={12}>
      <Panel title="Description" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="description"
              component={TextField}
              name="description"
              placeholder="Description"
              rows={1}
              maxRows={6}
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

StreamSection.propTypes = {
  providers: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
};

StreamSection.defaultProps = {
  editMode: false,
};

export default StreamSection;

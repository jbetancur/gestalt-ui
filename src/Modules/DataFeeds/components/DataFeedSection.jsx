import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const DataFeedSection = () => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel title="General" expandable={false}>
        <Row gutter={5}>
          <Col flex={6} xs={12}>
            <Field
              id="name"
              component={TextField}
              name="name"
              label="Name"
              required
            />
          </Col>

          <Col flex={12} xs={12}>
            <Field
              id="description"
              component={TextField}
              name="description"
              label="Description"
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

DataFeedSection.propTypes = {};

export default DataFeedSection;

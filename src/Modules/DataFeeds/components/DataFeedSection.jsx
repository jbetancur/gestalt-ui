import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/Form';
import { Panel } from 'components/Panels';

const DataFeedSection = () => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel expandable={false} fill>
        <Row gutter={5}>
          <Col flex={6} xs={12}>
            <Field
              id="name"
              component={TextField}
              name="name"
              label="Data Feed Name"
              required
              autoFocus
            />
          </Col>
          <Col flex={6} xs={12}>
            <Field
              id="description"
              component={TextField}
              name="description"
              label="Description"
              multiline
              rowsMax={4}
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

DataFeedSection.propTypes = {};

export default DataFeedSection;

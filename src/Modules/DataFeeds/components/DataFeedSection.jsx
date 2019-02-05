import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const DataFeedSection = () => (
  <Row gutter={5}>
    <Col flex={7} xs={12} sm={12}>
      <Panel title="Name" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="name"
              component={TextField}
              name="name"
              label="Data Feed Name"
              required
              autoFocus
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={5} xs={12} sm={12}>
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

DataFeedSection.propTypes = {};

export default DataFeedSection;

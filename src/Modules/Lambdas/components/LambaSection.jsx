import React from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const LambdaSection = () => (
  <Row gutter={5}>
    <Col flex={7} xs={12} sm={12} md={12}>
      <Panel title="General" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              component={TextField}
              name="name"
              label="Lambda Name"
              type="text"
              required
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={5} xs={12} sm={12} md={12}>
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

export default LambdaSection;

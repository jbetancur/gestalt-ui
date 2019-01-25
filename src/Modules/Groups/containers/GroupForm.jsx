import React from 'react';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Panel } from 'components/Panels';
import { TextField } from 'components/ReduxFormFields';

const GroupForm = () => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel expandable={false}>
        <Row gutter={5}>
          <Col flex={4} xs={12}>
            <Field
              component={TextField}
              name="name"
              label="Name"
              type="text"
              required
            />
          </Col>
          <Col flex={8} xs={12}>
            <Field
              component={TextField}
              name="description"
              label="Description"
              type="text"
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

GroupForm.propTypes = {};

GroupForm.defaultProps = {};

export default GroupForm;

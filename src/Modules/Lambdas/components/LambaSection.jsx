import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const LambdaSection = ({ providers, editMode }) => (
  <Row gutter={5}>
    <Col flex={6} xs={12} sm={12} md={12}>
      <Panel title="General" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="lambda-provider"
              component={SelectField}
              name="properties.provider.id"
              required
              label="Lambda Provider"
              itemLabel="name"
              itemValue="id"
              menuItems={providers}
              disabled={editMode}
              async
            />
          </Col>
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

    <Col flex={6} xs={12} sm={12} md={12}>
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

LambdaSection.propTypes = {
  providers: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
};

LambdaSection.defaultProps = {
  editMode: false,
};

export default LambdaSection;

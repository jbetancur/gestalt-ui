import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Field } from 'react-final-form';
import { SelectField, TextField } from 'components/Form';
import { Panel } from 'components/Panels';

const APIForm = ({
  editMode,
  providerKongsByGatewayData,
}) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel expandable={false}>
        <Row gutter={5}>
          <Col flex={6} xs={12}>
            <Field
              id="select-provider"
              component={SelectField}
              name="properties.provider.locations"
              required
              label="Provider"
              itemLabel="name"
              itemValue="id"
              menuItems={providerKongsByGatewayData}
              async
              disabled={editMode}
            />
          </Col>
          <Col flex={6} xs={12}>
            <Field
              component={TextField}
              name="name"
              label="Name"
              type="text"
              required
              disabled={editMode}
            />
          </Col>

          <Col flex={12}>
            <Field
              id="description"
              component={TextField}
              name="description"
              label="Description"
              multiline
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

APIForm.propTypes = {
  providerKongsByGatewayData: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
};

APIForm.defaultProps = {
  editMode: false,
};

// Connect to this forms state in the store so we can enum the values
export default APIForm;

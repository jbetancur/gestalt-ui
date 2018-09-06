import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';

const OtherConfigSection = ({ selectedProviderType }) => (
  <Row gutter={5}>
    {selectedProviderType.extraConfig &&
      <Col flex={6} xs={12}>
        <Field
          component={TextField}
          name="properties.config.extra"
          label="Extra Configuration (JSON)"
          type="text"
          rows={2}
        />
      </Col>}
  </Row>
);

OtherConfigSection.propTypes = {
  selectedProviderType: PropTypes.object.isRequired,
};

export default OtherConfigSection;

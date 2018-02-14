import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import JSONTree from 'components/JSONTree';

const OtherConfigSection = ({ selectedProviderType, provider }) => (
  <Row gutter={5}>
    {selectedProviderType.networking &&
      <Col flex={6} xs={12}>
        <Field
          component={TextField}
          name="properties.config.networks"
          label="Networks (JSON)"
          type="text"
          rows={2}
        />
      </Col>}
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

    {selectedProviderType.networking &&
    <Col flex={6} xs={12}>
      <JSONTree
        data={provider.properties.config.networks || []}
      />
    </Col>}
    {selectedProviderType.extraConfig &&
    <Col flex={6} xs={12}>
      <JSONTree
        data={provider.properties.config.extra || {}}
      />
    </Col>}
  </Row>
);

OtherConfigSection.propTypes = {
  selectedProviderType: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
};

export default OtherConfigSection;

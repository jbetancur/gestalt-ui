import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import TextField from 'components/TextField';
import JSONTree from 'components/JSONTree';

const OtherConfigSection = props => (
  <Row gutter={5}>
    {props.selectedProviderType.networking &&
      <Col flex={6} xs={12}>
        <Field
          component={TextField}
          name="properties.config.networks"
          label="Networks (JSON)"
          type="text"
          rows={2}
        />
      </Col>}
    {props.selectedProviderType.extraConfig &&
      <Col flex={6} xs={12}>
        <Field
          component={TextField}
          name="properties.config.extra"
          label="Extra Configuration (JSON)"
          type="text"
          rows={2}
        />
      </Col>}

    {props.selectedProviderType.networking &&
    <Col flex={6} xs={12}>
      <JSONTree
        data={props.provider.properties.config.networks || []}
      />
    </Col>}
    {props.selectedProviderType.extraConfig &&
    <Col flex={6} xs={12}>
      <JSONTree
        data={props.provider.properties.config.extra || {}}
      />
    </Col>}
  </Row>
);

OtherConfigSection.propTypes = {
  selectedProviderType: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
};

export default OtherConfigSection;

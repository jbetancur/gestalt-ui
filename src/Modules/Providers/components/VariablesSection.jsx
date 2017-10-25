import React from 'react';
import PropTypes from 'prop-types';
import { isUnixVariable } from 'util/validations';
import { Col, Row } from 'react-flexybox';
import { VariablesForm } from 'Modules/Variables';
import Div from 'components/Div';
import PreventAutoFill from 'components/PreventAutoFill';
import Fieldset from 'components/Fieldset';

const ProviderVariablesSection = props => (
  <Fieldset legend="Variables">
    <Row component={Div} disabled={props.envSchemaPending}>
      <PreventAutoFill />
      <Col flex={6} xs={12} sm={12}>
        <VariablesForm
          icon="public"
          addButtonLabel="Add Public Variable"
          fieldName="properties.config.env.public"
          keyFieldValidationFunction={isUnixVariable}
          keyFieldValidationMessage="must be a unix variable name"
        />
      </Col>
      <Col flex={6} xs={12} sm={12}>
        <VariablesForm
          icon="vpn_key"
          addButtonLabel="Add Private Variable"
          fieldName="properties.config.env.private"
          keyFieldValidationFunction={isUnixVariable}
          keyFieldValidationMessage="must be a unix variable name"
        />
      </Col>
    </Row>
  </Fieldset>
);

ProviderVariablesSection.propTypes = {
  envSchemaPending: PropTypes.bool.isRequired,
};

export default ProviderVariablesSection;

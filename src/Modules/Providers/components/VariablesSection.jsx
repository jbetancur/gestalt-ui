import React from 'react';
import PropTypes from 'prop-types';
import { isUnixVariable } from 'util/validations';
import { Col, Row } from 'react-flexybox';
import { VariablesForm } from 'Modules/Variables';
import Div from 'components/Div';
import { Panel } from 'components/Panels';
import PreventAutoFill from 'components/PreventAutoFill';

const ProviderVariablesSection = props => (
  <Row gutter={5}>
    <PreventAutoFill />
    <Col flex={6} xs={12} sm={12} component={Div} disabled={props.envSchemaPending}>
      <Panel title="Public Variables">
        <VariablesForm
          icon="add"
          addButtonLabel="Add Variable"
          fieldName="properties.config.env.public"
          keyFieldValidationFunction={isUnixVariable}
          keyFieldValidationMessage="must be a unix variable name"
        />
      </Panel>
    </Col>
    <Col flex={6} xs={12} sm={12} component={Div} disabled={props.envSchemaPending}>
      <Panel title="Private Variables">
        <VariablesForm
          icon="add"
          addButtonLabel="Add Variable"
          fieldName="properties.config.env.private"
          keyFieldValidationFunction={isUnixVariable}
          keyFieldValidationMessage="must be a unix variable name"
        />
      </Panel>
    </Col>
  </Row>
);

ProviderVariablesSection.propTypes = {
  envSchemaPending: PropTypes.bool.isRequired,
};

export default ProviderVariablesSection;

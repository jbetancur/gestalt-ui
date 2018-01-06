import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { UnixVariablesForm } from 'Modules/Variables';
import Div from 'components/Div';
import { Panel } from 'components/Panels';
import PreventAutoFill from 'components/PreventAutoFill';

const ProviderVariablesSection = props => (
  <Row gutter={5}>
    <PreventAutoFill />
    <Col flex={6} xs={12} sm={12} component={Div} disabled={props.envSchemaPending}>
      <Panel title="Public Variables" noPadding>
        <FieldArray
          component={UnixVariablesForm}
          name="properties.config.env.public"
        />
      </Panel>
    </Col>
    <Col flex={6} xs={12} sm={12} component={Div} disabled={props.envSchemaPending}>
      <Panel title="Private Variables" noPadding>
        <FieldArray
          component={UnixVariablesForm}
          name="properties.config.env.private"
        />
      </Panel>
    </Col>
  </Row>
);

ProviderVariablesSection.propTypes = {
  envSchemaPending: PropTypes.bool.isRequired,
};

export default ProviderVariablesSection;

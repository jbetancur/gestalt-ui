import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { UnixVariablesForm } from 'Modules/Variables';
import Div from 'components/Div';
import { Panel } from 'components/Panels';
import PreventAutoFill from 'components/PreventAutoFill';

const ProviderVariablesSection = ({ envSchemaPending }) => (
  <Row gutter={5}>
    <PreventAutoFill />
    <Col flex={12} component={Div} disabled={envSchemaPending}>
      <Panel title="Public Variables" noPadding>
        <FieldArray
          component={UnixVariablesForm}
          name="properties.config.env.public"
        />
      </Panel>
    </Col>
    <Col flex={12} component={Div} disabled={envSchemaPending}>
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

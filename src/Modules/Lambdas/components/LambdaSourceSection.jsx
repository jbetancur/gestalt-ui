
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { AceEditor } from 'components/ReduxFormFields';
import { SelectField as MDSelectField } from 'react-md';
import { Panel } from 'components/Panels';
import withLambdaState from '../hoc/withLambdaState';

const LambdaSourceSection = ({ theme, lambdaStateActions, selectedRuntime }) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel title="Source Code" noPadding>
        <Row gutter={10}>
          <Col flex={3} xs={12} sm={6} md={6}>
            <MDSelectField
              id="select-code-theme"
              label="Editor Theme"
              menuItems={['monokai', 'chrome']}
              defaultValue={theme}
              onChange={lambdaStateActions.handleTheme}
              fullWidth
            />
          </Col>
        </Row>

        <Row>
          <Col flex={12}>
            <Field
              component={AceEditor}
              mode={selectedRuntime.codeFormat}
              theme={theme}
              name="properties.code"
              maxLines={75}
              minLines={15}
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

LambdaSourceSection.propTypes = {
  theme: PropTypes.string.isRequired,
  lambdaStateActions: PropTypes.object.isRequired,
  selectedRuntime: PropTypes.object.isRequired,
};

export default withLambdaState(LambdaSourceSection);

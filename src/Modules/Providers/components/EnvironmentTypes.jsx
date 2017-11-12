import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexybox';
import { Field } from 'redux-form';
import SelectionControlGroup from 'components/SelectionControlGroup';
import HelpText from 'components/HelpText';
import { Panel } from 'components/Panels';
import environmentTypes from '../lists/environmentTypes';

class EnvironmentTypes extends PureComponent {
  render() {
    return (
      <Panel title="Allowed Environments">
        <Row>
          <Col flex={4} xs={12} sm={3}>
            <HelpText
              fontSize="14px"
              message="Allowed Environments this Provider can be used with"
            />
            <Field
              inline
              controlStyle={{ display: 'block' }}
              component={SelectionControlGroup}
              type="checkbox"
              id="restricted-environment-types"
              name="properties.environment_types"
              controls={environmentTypes}
            />
          </Col>
        </Row>
      </Panel>
    );
  }
}

export default EnvironmentTypes;

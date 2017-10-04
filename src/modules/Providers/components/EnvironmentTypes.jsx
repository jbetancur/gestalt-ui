import React, { PureComponent } from 'react';
import { Row, Col } from 'react-flexybox';
import { Field } from 'redux-form';
import SelectionControlGroup from 'components/SelectionControlGroup';
import HelpText from 'components/HelpText';
import environmentTypes from '../lists/environmentTypes';

class EnvironmentTypes extends PureComponent {
  render() {
    return (
      <Row center>
        <Col flex={2} xs={12} sm={3}>
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
        <Col flex={3} xs={12} sm={4}>
          <HelpText
            fontSize="14px"
            message="Setting all or none is equivalent to allow from all"
          />
        </Col>
      </Row>
    );
  }
}

export default EnvironmentTypes;

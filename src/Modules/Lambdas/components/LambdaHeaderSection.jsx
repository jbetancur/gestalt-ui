import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { SelectField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import responseHeaders from '../lists/responseHeaders';

class LambdaHeaderSection extends PureComponent {
  render() {
    return (
      <Panel title="Response Header" expandable={false} fill>
        <Row gutter={5}>
          <Col flex={6} xs={12} sm={12}>
            <Field
              id="select-return-type"
              component={SelectField}
              name="properties.headers.['Content-Type']"
              menuItems={responseHeaders}
              itemLabel="displayName"
              itemValue="value"
              required
              label="Content Type"
            />
          </Col>
        </Row>
      </Panel>
    );
  }
}

export default LambdaHeaderSection;

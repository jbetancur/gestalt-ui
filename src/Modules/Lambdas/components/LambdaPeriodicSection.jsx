import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField, AceEditor } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { Subtitle } from 'components/Typography';
import moment from 'moment-timezone';
import { some, isEmpty } from 'lodash';

const timezones = moment.tz.names();

const LambdaPeriodicSection = ({ formValues, errors, editMode }) => {
  const periodicExpanded = editMode && !some(formValues.properties.periodic_info, isEmpty);

  return (
    <Panel
      title="Periodic Configuration"
      defaultExpanded={periodicExpanded}
      error={errors.properties.periodic_info}
      fill
    >
      <Row gutter={5}>
        <Col flex={6} xs={12} sm={12} md={6}>
          <Field
            component={TextField}
            name="properties.periodic_info.schedule"
            label="Schedule"
            helpText="Date and time format - ISO 8601"
            type="text"
          />
        </Col>
        <Col flex={3} xs={12} sm={12} md={6}>
          <Field
            id="periodic-timezone"
            component={SelectField}
            name="properties.periodic_info.timezone"
            label="Timezone"
            menuItems={timezones}
          />
        </Col>
        <Col flex={3} xs={12} sm={12} md={12}>
          <Field
            component={TextField}
            name="properties.periodic_info.payload.eventName"
            label="Event Name"
            type="text"
          />
        </Col>
        <Col flex={12} xs={12} sm={12} md={12}>
          <Subtitle>JSON Payload</Subtitle>
          <Field
            component={AceEditor}
            mode="json"
            theme="chrome"
            name="properties.periodic_info.payload.data"
            minLines={5}
            maxLines={20}
          />
        </Col>
      </Row>
    </Panel>
  );
};

LambdaPeriodicSection.propTypes = {
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
};

LambdaPeriodicSection.defaultProps = {
  editMode: false,
};

export default LambdaPeriodicSection;

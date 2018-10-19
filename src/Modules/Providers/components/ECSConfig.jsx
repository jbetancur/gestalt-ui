import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { TextField, SelectField } from 'components/ReduxFormFields';
import { composeValidators, required } from 'util/forms';

const ECSConfig = ({ editMode, subTypes }) => (
  <Row gutter={5}>
    <Col flex={3} xs={12} sm={4} md={4}>
      <Field
        id="ecs-subtype"
        component={SelectField}
        name="properties.provider_subtype"
        menuItems={subTypes}
        label="Sub Type"
        validate={composeValidators(required('a provider sub type is required'))}
      />
    </Col>
    <Col flex={3} xs={12} sm={4} md={4}>
      <Field
        component={TextField}
        name="properties.config.cluster"
        label="Cluster"
        validate={composeValidators(required())}
        required
      />
    </Col>
    <Col flex={3} xs={12} sm={4} md={4}>
      <Field
        component={TextField}
        name="properties.config.region"
        label="Region"
        validate={composeValidators(required())}
        required
      />
    </Col>
    <Col flex={3} xs={12} sm={4} md={4}>
      <Field
        component={TextField}
        name="properties.config.taskRoleArn"
        label="Task Role ARN"
      />
    </Col>
    <Col flex={3} xs={12} sm={4} md={4}>
      <Field
        component={TextField}
        name="properties.config.awsLogGroup"
        label="AWS Log Group"
      />
    </Col>

    <Col flex={6} xs={12} sm={4} md={4}>
      <Field
        component={TextField}
        name="properties.config.secret_key"
        label="Secret Key"
        type="password"
        passwordIcon={null}
        helpText={editMode ? 'Enter a new value to update the secret key' : 'The secret key will not be displayed after creation'}
      />
    </Col>
    <Col flex={6} xs={12} sm={4} md={4}>
      <Field
        component={TextField}
        name="properties.config.access_key"
        label="Access Key"
        type="password"
        passwordIcon={null}
        helpText={editMode ? 'Enter a new value to update the access key' : 'The access key will not be displayed after creation'}
      />
    </Col>
  </Row>
);

ECSConfig.propTypes = {
  subTypes: PropTypes.array,
  editMode: PropTypes.bool,
};

ECSConfig.defaultProps = {
  subTypes: [],
  editMode: false,
};

export default ECSConfig;

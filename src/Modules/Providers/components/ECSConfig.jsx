import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { TextField, SelectField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { composeValidators, required } from 'util/forms';

const ECSConfig = ({ editMode, subTypes }) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel noShadow noPadding expandable={false}>
        <Row gutter={5}>
          <Col flex={3} xs={12} sm={6} md={6}>
            <Field
              id="ecs-subtype"
              component={SelectField}
              name="properties.provider_subtype"
              menuItems={subTypes}
              label="Sub Type"
              validate={composeValidators(required('a provider sub type is required'))}
            />
          </Col>
          <Col flex={3} xs={12} sm={6} md={6}>
            <Field
              component={TextField}
              name="properties.config.cluster"
              label="Cluster"
              validate={composeValidators(required())}
              required
            />
          </Col>
          <Col flex={3} xs={12} sm={6} md={6}>
            <Field
              component={TextField}
              name="properties.config.region"
              label="Region"
              validate={composeValidators(required())}
              required
              helpText="e.g. us-east-1"
            />
          </Col>
          <Col flex={3} xs={12} sm={6} md={6}>
            <Field
              component={TextField}
              name="properties.config.taskRoleArn"
              label="Task Role ARN"
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={6} xs={12}>
      <Panel title="Security" noShadow expandable={false}>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              component={TextField}
              name="properties.config.secret_key"
              label="Secret Key"
              type="password"
              autoComplete="new-password"
              passwordIcon={null}
              helpText={editMode ? 'Enter a new value to update the secret key' : 'The secret key will not be displayed after creation'}
            />
          </Col>
          <Col flex={12}>
            <Field
              component={TextField}
              name="properties.config.access_key"
              label="Access Key"
              type="password"
              autoComplete="new-password"
              passwordIcon={null}
              helpText={editMode ? 'Enter a new value to update the access key' : 'The access key will not be displayed after creation'}
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={6} xs={12}>
      <Panel title="Kong Configuration" noShadow expandable={false}>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              component={TextField}
              name="properties.config.kongConfigureUrl"
              label="Kong Configuration URL"
              helpText="Externally accessible URL for Kong"
            />
          </Col>

          <Col flex={12}>
            <Field
              component={TextField}
              name="properties.config.kongManagementUrl"
              label="The Kong Management URL"
              helpText="Externally accessible management URL for Kong"
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={6}>
      <Panel title="Logging" noShadow expandable={false}>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              component={TextField}
              name="properties.config.awsLogGroup"
              label="AWS Log Group"
              helpText="The AWS Log Group"
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={6}>
      <Panel title="Image Options" noShadow expandable={false}>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              component={TextField}
              name="properties.config.sidecarContainerImageOverride"
              label="Sidecar Container Image Override"
              helpText="Override the default side car container image"
            />
          </Col>
        </Row>
      </Panel>
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

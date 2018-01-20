import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import ActivityContainer from 'components/ActivityContainer';
import Form from 'components/Form';
import { StepActions } from 'components/Stepper';
import { Col, Row } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import Fieldset from 'components/Fieldset';
import { Caption } from 'components/Typography';
import Security from '../components/Security';
import HTTPMethods from '../components/HTTPMethods';
import RateLimit from '../components/RateLimit';
import validations from './validations';

const APIEndpointForm = (props) => {
  const { handleSubmit, formValues, previousPage, cancel, implementationType, portMappings, pending, submitted, invalid, pristine } = props;
  const finishDisabled = submitted || invalid || pristine || pending;

  return (
    <Form onSubmit={handleSubmit} disabled={pending}>
      {pending && <ActivityContainer primary centered id="apiendpoint-wizard--loading" />}
      <Row gutter={5}>
        <Col flex={6} xs={12}>
          <Field
            component={TextField}
            name="properties.resource"
            label="Relative Path"
            type="text"
            helpText="ex: /path or /path1/path2"
            required
          />
        </Col>

        {implementationType === 'lambda' &&
          <Col flex={3} xs={12}>
            <Field
              id="synchronous"
              component={Checkbox}
              name="properties.synchronous"
              checked={formValues.properties.synchronous}
              label="Sync"
            />
            <Caption light>sync waits for a return response</Caption>
          </Col>}

        <Col flex={3} xs={12}>
          <RateLimit isToggled={formValues.properties.plugins.rateLimit && formValues.properties.plugins.rateLimit.enabled} />
        </Col>
      </Row>

      <Row gutter={5}>
        {implementationType === 'container' &&
        <Col flex={6} xs={12}>
          <Field
            id="container-ports-dropdown"
            component={SelectField}
            name="properties.container_port_name"
            menuItems={portMappings}
            itemLabel="name"
            itemValue="name"
            label="Container Port Name"
            required
          />
        </Col>}
      </Row>

      <Row gutter={5}>
        <Col flex={6} xs={12}>
          <Fieldset legend="Allowed HTTP Methods" minHeight="105px">
            <HTTPMethods />
          </Fieldset>
        </Col>
        <Col flex={6} xs={12}>
          <Fieldset legend="Security" minHeight="105px">
            <Security isEnabled={formValues.properties.plugins.gestaltSecurity && formValues.properties.plugins.gestaltSecurity.enabled} />
          </Fieldset>
        </Col>
      </Row>

      <StepActions>
        <Button flat onClick={cancel}>Cancel</Button>
        {previousPage && <Button flat onClick={previousPage} disabled={pending}>Back</Button>}
        <Button raised primary type="submit" disabled={finishDisabled}>Finish</Button>
      </StepActions>
    </Form>
  );
};

APIEndpointForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  previousPage: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  cancel: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  portMappings: PropTypes.array,
  implementationType: PropTypes.string.isRequired,
  pending: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

APIEndpointForm.defaultProps = {
  previousPage: false,
  portMappings: [],
  pending: false,
  submitted: false,
  invalid: false,
  pristine: false,
};

export default reduxForm({
  form: 'APIEndpointMappingWizard',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validations,
})(APIEndpointForm);

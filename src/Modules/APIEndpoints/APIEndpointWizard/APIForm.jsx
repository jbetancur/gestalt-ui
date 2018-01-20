import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Form from 'components/Form';
import { StepActions } from 'components/Stepper';
import { Col, Row } from 'react-flexybox';
import { SelectField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import validations from './validations';

const APIForm = (props) => {
  const { handleSubmit, apis, previousPage, cancel, submitting, invalid, pristine } = props;
  const nextDisabled = submitting || invalid || pristine;

  return (
    <Form onSubmit={handleSubmit}>
      <Row gutter={5} center>
        <Col flex={6} xs={12}>
          <Field
            id="wizard--select-api"
            name="apiId"
            type="text"
            component={SelectField}
            menuItems={apis.length ? apis : [{ id: '', name: 'No Avalable APIs' }]}
            itemLabel="name"
            itemValue="id"
            label="API"
            helpText="Select an API"
            async
            required
          />
        </Col>
      </Row>

      <StepActions>
        <Button flat onClick={cancel}>Cancel</Button>
        {previousPage && <Button flat onClick={previousPage}>Back</Button>}
        <Button raised primary type="submit" disabled={nextDisabled}>Next</Button>
      </StepActions>
    </Form>
  );
};

APIForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  previousPage: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  cancel: PropTypes.func.isRequired,
  apis: PropTypes.array,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

APIForm.defaultProps = {
  previousPage: false,
  apis: [],
  submitting: false,
  invalid: false,
  pristine: false,
};

export default reduxForm({
  form: 'APIEndpointMappingWizard',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validations,
  initialValues: {
    properties: {
      methods: 'GET', // converts to array
      plugins: {
        rateLimit: {
          enabled: false,
          perMinute: 60,
        },
        gestaltSecurity: {
          enabled: false,
          users: [],
          groups: [],
        },
      },
      implementation_type: '',
      implementation_id: '',
      resource: '',
      synchronous: true,
    }
  },
})(APIForm);

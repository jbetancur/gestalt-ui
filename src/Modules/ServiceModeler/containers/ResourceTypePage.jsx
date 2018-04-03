import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, reduxForm } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import Form from 'components/Form';
import { Button } from 'components/Buttons';
import { StepActions } from 'components/Stepper';
import SupportedResourcesForm from '../components/SupportedResourcesForm';
import validate from './resourceTypeValidations';

const ResourceTypePage = ({ handleSubmit, previousPage, resourceTypes }) => (
  <Form onSubmit={handleSubmit}>
    <Row gutter={5}>
      <Col flex={12}>
        <FieldArray
          name="properties.supported_resources"
          component={SupportedResourcesForm}
          resourceTypes={resourceTypes}
        />
      </Col>

      <StepActions>
        {previousPage && <Button flat onClick={previousPage}>Back</Button>}
        <Button raised primary type="submit">Next</Button>
      </StepActions>
    </Row>
  </Form>
);

ResourceTypePage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  resourceTypes: PropTypes.array.isRequired,
};

ResourceTypePage.defaultProps = {
  resourceTypes: [],
};

export default reduxForm({
  form: 'ServiceModelerWizard',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(ResourceTypePage);

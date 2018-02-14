import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FieldArray, reduxForm } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import Form from 'components/Form';
import { Button } from 'components/Buttons';
import { StepActions } from 'components/Stepper';
import ActionMappingsForm from '../components/ActionMappingsForm';
import validate from './actionValidations';

const ActionsPage = ({ handleSubmit, previousPage, lambdas }) => (
  <Form onSubmit={handleSubmit}>
    <Row>
      <Col flex={12}>
        <FieldArray
          name="properties.provider_def.endpoints"
          component={ActionMappingsForm}
          lambdas={lambdas}
        />
      </Col>
      <StepActions>
        {previousPage && <Button flat onClick={previousPage}>Back</Button>}
        <Button raised primary type="submit">Finish</Button>
      </StepActions>
    </Row>
  </Form>
);

ActionsPage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  lambdas: PropTypes.array,
};

ActionsPage.defaultProps = {
  lambdas: [],
};

export default compose(
  reduxForm({
    form: 'ServiceModelerWizard',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
  })
)(ActionsPage);

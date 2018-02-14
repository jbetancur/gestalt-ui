import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import Form from 'components/Form';
import { TextField, SelectField } from 'components/ReduxFormFields';
import { StepActions } from 'components/Stepper';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import { PropertyDefForm } from 'Modules/ResourceTypes';
import validate from './providerTypeValidations';
import { getServiceSpecModel } from '../selectors';

const ProviderTypePage = ({ handleSubmit, previousPage, providerTypes, resourceTypes, change }) => {
  const handleProviderNameChange = (v1, v2) => {
    const name = v2.replace(/\s/g, '_');
    change('properties.provider_def.name', `Gestalt::Configuration::Provider${name}`);
  };

  return (
    <Form onSubmit={handleSubmit} autoComplete="false">
      <Row center>
        <Col flex={12}>
          <Row gutter={5}>
            <Col flex={4}>
              <Field
                name="name"
                component={TextField}
                label="Service Name"
                onChange={handleProviderNameChange}
              />
            </Col>
            <Col flex={8}>
              <Field
                component={TextField}
                name="description"
                label="Service Description"
              />
            </Col>
          </Row>
        </Col>
        <Col flex={12}>
          <Panel title="Advanced" defaultExpanded={false}>
            <Row gutter={5}>
              <Col flex={6}>
                <Field
                  name="properties.provider_def.name"
                  type="text"
                  component={TextField}
                  label="Provider Name"
                />
              </Col>
              <Col flex={6}>
                <Field
                  id="select-properties.provider_def.extend"
                  component={SelectField}
                  name="properties.provider_def.extend"
                  menuItems={providerTypes}
                  itemLabel="name"
                  itemValue="name"
                  required
                  label="Extend Provider"
                  async
                  helpText="Extend an existing Provider"
                />
              </Col>
            </Row>

            <FieldArray
              name="properties.provider_def.property_defs"
              component={PropertyDefForm}
              resourceTypes={resourceTypes}
            />
          </Panel>
        </Col>
      </Row>
      <StepActions>
        {previousPage && <Button flat onClick={previousPage}>Back</Button>}
        <Button raised primary type="submit">Next</Button>
      </StepActions>
    </Form>
  );
};

ProviderTypePage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  previousPage: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  resourceTypes: PropTypes.array,
  providerTypes: PropTypes.array,
  change: PropTypes.func.isRequired,
};

ProviderTypePage.defaultProps = {
  previousPage: false,
  resourceTypes: [],
  providerTypes: [],
};

export default reduxForm({
  form: 'ServiceModelerWizard',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  initialValues: getServiceSpecModel(),
})(ProviderTypePage);

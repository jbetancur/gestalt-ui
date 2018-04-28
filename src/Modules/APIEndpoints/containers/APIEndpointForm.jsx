import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Autocomplete } from 'react-md';
import { Checkbox, SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import { Caption } from 'components/Typography';
import Form from 'components/Form';
import { Panel } from 'components/Panels';
// import authTypes from '../../lists/authTypes';
import RateLimit from '../components/RateLimit';
import Security from '../components/Security';
import HTTPMethods from '../components/HTTPMethods';
import implementationTypes from '../lists/implementationTypes';

const APIEndpointForm = ({
  form,
  values,
  match,
  apiEndpointPending,
  handleSubmit,
  pristine,
  submitting,
  apiEndpoint,
  fetchlambdasData,
  fetchcontainersData,
  lambdasData,
  containersData,
  lambdasDataPending,
  containersDataPending,
  editMode,
}) => {
  const backLink = `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`;

  // TODO: implement selectors
  const containerPorts = () => {
    const container = containersData.find(cont => cont.id === values.properties.implementation_id);
    return container && container.properties && container.properties.port_mappings;
  };

  const fetchContainers = () => {
    form.change('properties.container_port_name', '');
    fetchcontainersData();
  };

  const handleAutoComplete = (value) => {
    form.change('properties.implementation_id', value);
  };

  const resetForm = (value) => {
    form.change('properties.implementation_id', '');
    form.change('properties.implementation_type', value);
  };

  const disabledSubmit = pristine || apiEndpointPending || lambdasDataPending || containersDataPending || submitting;

  return (
    <Form onSubmit={handleSubmit} autoComplete="off" disabled={apiEndpointPending} paddingBottom="64px">
      <Row gutter={5}>
        <Col flex={12}>
          <Panel title="General" expandable={false}>
            <Row gutter={5}>
              <Col flex={2} xs={12} lg={1}>
                <Field
                  id="endpoint-type"
                  component={SelectField}
                  name="properties.implementation_type"
                  menuItems={implementationTypes}
                  itemLabel="name"
                  itemValue="value"
                  label="Type"
                  onChange={resetForm}
                  required
                />
              </Col>
              <Col flex>
                <Field
                  component={TextField}
                  name="properties.resource"
                  label="Resource Path"
                  type="text"
                  required
                  helpText="ex: /path or /path1/path2"
                />
              </Col>
              {values.properties.implementation_type === 'container' &&
              <Col flex={3} xs={12} sm={6} md={6}>
                <Field
                  id="containers-dropdown"
                  component={SelectField}
                  name="properties.implementation_id"
                  menuItems={containersData}
                  itemLabel="name"
                  itemValue="id"
                  required
                  label="Container"
                  onFocus={fetchContainers}
                  async
                  helpText="container from the current environment"
                />
              </Col>}
              {values.properties.implementation_type === 'container' &&
              <Col flex={2} xs={12} sm={6} md={6}>
                <Field
                  id="container-ports-dropdown"
                  component={SelectField}
                  name="properties.container_port_name"
                  menuItems={containerPorts()}
                  itemLabel="name"
                  itemValue="name"
                  required
                  label="Container Port Name"
                />
              </Col>}
              {values.properties.implementation_type === 'lambda' &&
                <Col flex={4} xs={12} sm={12}>
                  <Autocomplete
                    id="lambdas-dropdown"
                    data={lambdasData}
                    dataLabel="name"
                    dataValue="id"
                    label="Search Lambdas"
                    clearOnAutocomplete
                    onClick={() => fetchlambdasData()}
                    onAutocomplete={handleAutoComplete}
                    helpText="search in the current org by lambda name/uuid, or paste a lambda uuid below"
                  />
                  {/* TODO: needs a custom search control since autocomplete above cannot be validated with redux-form so we do it here */}
                  {(values.properties.implementation_type === 'lambda') &&
                    <Field
                      component={TextField}
                      name="properties.implementation_id"
                      label="Lambda UUID"
                    />}
                </Col>}
              {values.properties.implementation_type === 'lambda' &&
                <Col flex={1} xs={12} sm={6} md={6}>
                  <Field
                    id="synchronous"
                    component={Checkbox}
                    name="properties.synchronous"
                    // TODO: Find out why redux-form state for bool doesn't apply
                    defaultChecked={values.properties.synchronous}
                    label="Sync"
                  />
                  <Caption light>sync waits for a return response</Caption>
                </Col>}
              <Col flex={2} xs={12} sm={6} md={6}>
                <RateLimit isToggled={values.properties.plugins.rateLimit && values.properties.plugins.rateLimit.enabled} />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={6} xs={12} sm={12}>
          <Panel title="Allowed HTTP Methods" minHeight="105px" expandable={false}>
            <HTTPMethods />
          </Panel>
        </Col>

        <Col flex={6} xs={12} sm={12}>
          <Panel title="Security" minHeight="105px" expandable={false}>
            <Security isToggled={values.properties.plugins.gestaltSecurity && values.properties.plugins.gestaltSecurity.enabled} />
          </Panel>
        </Col>
      </Row>

      <FullPageFooter>
        <Button
          flat
          iconChildren={!editMode ? null : 'arrow_back'}
          disabled={apiEndpointPending || submitting}
          component={Link}
          to={backLink}
        >
          {editMode ? `${apiEndpoint.properties.parent && apiEndpoint.properties.parent.name} API` : 'Cancel'}
        </Button>
        <Button
          raised
          iconChildren="save"
          type="submit"
          disabled={disabledSubmit}
          primary
        >
          {editMode ? 'Update' : 'Create'}
        </Button>
      </FullPageFooter>
    </Form>
  );
};

APIEndpointForm.propTypes = {
  form: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  apiEndpoint: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  apiEndpointPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  fetchlambdasData: PropTypes.func.isRequired,
  fetchcontainersData: PropTypes.func.isRequired,
  lambdasData: PropTypes.array.isRequired,
  containersData: PropTypes.array.isRequired,
  lambdasDataPending: PropTypes.bool,
  containersDataPending: PropTypes.bool,
  editMode: PropTypes.bool,
};

APIEndpointForm.defaultProps = {
  lambdasDataPending: false,
  containersDataPending: false,
  editMode: false,
};

export default APIEndpointForm;

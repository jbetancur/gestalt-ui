import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { Autocomplete } from 'react-md';
import { Checkbox, SelectField, TextField } from 'components/ReduxFormFields';
import { Caption } from 'components/Typography';
import Form from 'components/Form';
import { Chips } from 'components/Lists';
import { Panel } from 'components/Panels';
import RateLimit from '../components/RateLimit';
import HTTPMethods from '../components/HTTPMethods';
import implementationTypes from '../lists/implementationTypes';

const APIEndpointForm = ({
  match,
  form,
  values,
  apiEndpointPending,
  handleSubmit,
  pristine,
  submitting,
  fetchlambdasData,
  fetchcontainersData,
  lambdasData,
  containersData,
  lambdasDataPending,
  containersDataPending,
  editMode,
}) => {
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
    <Form
      onSubmit={handleSubmit}
      autoComplete="off"
      disabled={apiEndpointPending}
      disabledSubmit={disabledSubmit}
      submitTitle={editMode ? 'Update' : 'Create'}
      showCancel={!editMode}
      cancelTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`}
    >
      <Row gutter={5}>
        <Col flex={12}>
          <Panel title="Mapping" expandable={false}>
            <Row gutter={5}>
              <Col flex={2} xs={12} sm={4}>
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
                  {/* TODO: needs a custom search control since autocomplete above cannot be validated with react-final-form so we do it here */}
                  {(values.properties.implementation_type === 'lambda') &&
                    <Field
                      component={TextField}
                      name="properties.implementation_id"
                      label="Lambda UUID"
                    />}
                </Col>}
              {values.properties.implementation_type === 'container' &&
                <Col flex={6} xs={12} sm={12}>
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
                <Col flex={4} xs={12} sm={12}>
                  <Field
                    id="container-ports-dropdown"
                    component={SelectField}
                    name="properties.container_port_name"
                    menuItems={containerPorts()}
                    itemLabel="name"
                    itemValue="name"
                    required
                    label="Service Label"
                  />
                </Col>}
            </Row>
          </Panel>
        </Col>

        <Col flex={12}>
          <Panel title="Route Filtering" expandable={false}>
            <Row gutter={5} alignItems="baseline">
              <Col flex={6}>
                <Field
                  component={TextField}
                  name="properties.resource"
                  label="Resource Path"
                  type="text"
                  required={values.properties.hosts && !values.properties.hosts.length}
                  helpText="a relative path is only required if there are no hosts: e.g. /path or /path1/path2"
                />
              </Col>

              <Col flex={6}>
                <Field
                  id="apiendpoints--hostnames"
                  label="Hostname"
                  addLabel="Add Host"
                  component={Chips}
                  name="properties.hosts"
                  ignorePrefixValidation
                  forceLowerCase
                  helpText="at least 1 host is required if a relative path is not specified: e.g. galacticfog.com"
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={6} xs={12} sm={12}>
          <Panel title="Allowed HTTP Methods" minHeight="135px" expandable={false} fill>
            <Caption light>* at least one http method is required</Caption>
            <HTTPMethods />
          </Panel>
        </Col>

        <Col flex={6} xs={12} sm={12}>
          <Panel title="Options" minHeight="135px" expandable={false} fill>
            <Row>
              <Col flex={6} xs={12} sm={6} md={6}>
                <Field
                  id="show-api-endpoints-security"
                  component={Checkbox}
                  name="properties.plugins.gestaltSecurity.enabled"
                  defaultChecked={values.properties.plugins.gestaltSecurity && values.properties.plugins.gestaltSecurity.enabled}
                  label="Require Authentication"
                  hasMargin={false}
                />
              </Col>

              {values.properties.implementation_type === 'lambda' &&
                <React.Fragment>
                  <Col flex={12}>
                    <Field
                      id="synchronous"
                      component={Checkbox}
                      name="properties.synchronous"
                      defaultChecked={values.properties.synchronous}
                      label="Synchronous"
                      hasMargin={false}
                    />
                  </Col>

                  <Col flex={12}>
                    <Field
                      id="is_http_aware"
                      component={Checkbox}
                      name="properties.is_http_aware"
                      defaultChecked={values.properties.is_http_aware}
                      label="Lambda managed HTTP response"
                      hasMargin={false}
                    />
                  </Col>
                </React.Fragment>}
              <Col flex={12} xs={12} sm={6} md={6}>
                <RateLimit isToggled={values.properties.plugins.rateLimit && values.properties.plugins.rateLimit.enabled} />
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>
    </Form>
  );
};

APIEndpointForm.propTypes = {
  match: PropTypes.object.isRequired,
  form: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
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

import React from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues, change } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardText, LinearProgress, Autocomplete } from 'react-md';
import ActionsToolbar from 'components/ActionsToolbar';
import Checkbox from 'components/Checkbox';
import SelectField from 'components/SelectField';
import SelectionControlGroup from 'components/SelectionControlGroup';
import TextField from 'components/TextField';
import { Button } from 'components/Buttons';
import HelpText from 'components/HelpText';
import DetailsPane from 'components/DetailsPane';
// import authTypes from '../../lists/authTypes';
import RateLimit from '../RateLimit';
import Security from '../Security';
import httpMethods from '../../lists/httpMethods';
import implementationTypes from '../../lists/implementationTypes';

const APIEndpointForm = (props) => {
  const {
    form,
    values,
    dispatch,
    match,
    apiEndpointPending,
    apiEndpointUpdatePending,
    onSubmit,
    invalid,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    apiEndpoint,
    fetchLambdasDropDown,
    fetchContainersDropDown,
    lambdasDropDown,
    containersDropDown,
    lambdasDropDownPending,
    containersDropDownPending,
  } = props;

  const backLink = `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`;

  // TODO: implement selectors
  const containerPorts = () => {
    const container = containersDropDown.find(cont => cont.id === values.properties.implementation_id);
    return container && container.properties && container.properties.port_mappings;
  };

  const fetchContainers = () => {
    dispatch(change(form, 'properties.container_port_name', ''));
    fetchContainersDropDown(match.params.fqon, match.params.environmentId);
  };

  const handleAutoComplete = (value) => {
    dispatch(change(form, 'properties.implementation_id', value));
  };

  const resetForm = () => {
    dispatch(change(form, 'properties.implementation_id', ''));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      {apiEndpoint.id &&
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12}>
            <DetailsPane model={apiEndpoint} />
          </Col>
        </Row>}
      <Row gutter={5} center>
        <Col component={Card} flex={10} xs={12} sm={12}>
          <CardTitle title={title} />
          <ActionsToolbar>
            <Button
              flat
              iconChildren="arrow_back"
              disabled={apiEndpointUpdatePending || apiEndpointPending || submitting}
              component={Link}
              to={backLink}
            >
              {cancelLabel}
            </Button>
            <Button
              raised
              iconChildren="save"
              type="submit"
              disabled={pristine || apiEndpointPending || apiEndpointUpdatePending || lambdasDropDownPending || containersDropDownPending || invalid || submitting}
              primary
            >
              {submitLabel}
            </Button>
          </ActionsToolbar>
          {(apiEndpointUpdatePending || apiEndpointPending) && <LinearProgress id="apiEndpoint-form" />}
          <CardText>
            <Row gutter={5}>
              <Col flex={2} xs={12}>
                <Field
                  id="endpoint-type"
                  component={SelectField}
                  name="properties.implementation_type"
                  menuItems={implementationTypes}
                  itemLabel="name"
                  itemValue="value"
                  label="Type"
                  onChange={() => resetForm()}
                  required
                />
              </Col>
              <Col flex={5} xs={12}>
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
              <Col flex={3} xs={12}>
                <Field
                  id="containers-dropdown"
                  component={SelectField}
                  name="properties.implementation_id"
                  menuItems={containersDropDown}
                  itemLabel="name"
                  itemValue="id"
                  required
                  label="Container"
                  onFocus={fetchContainers}
                  async
                  helpText="container from the current environment"
                />
              </Col>}
              {values.properties.implementation_type === 'lambda' &&
                <Col flex={3} sm={6} xs={12}>
                  <Autocomplete
                    id="lambdas-dropdown"
                    data={lambdasDropDown}
                    dataLabel="name"
                    dataValue="id"
                    label="Search Lambdas"
                    clearOnAutocomplete
                    onClick={() => fetchLambdasDropDown(match.params.fqon)}
                    onAutocomplete={value => handleAutoComplete(value)}
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
                <Col flex={2} xs={6}>
                  <Field
                    id="synchronous"
                    component={Checkbox}
                    name="properties.synchronous"
                    // TODO: Find out why redux-form state for bool doesn't apply
                    checked={values.properties.synchronous}
                    label="Synchronous"
                  />
                </Col>}
              {values.properties.implementation_type === 'container' &&
                <Col flex={2} xs={12}>
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
              <Row gutter={5}>
                <Col flex={6} xs={12}>
                  <Field
                    inline
                    controlStyle={{ minWidth: '7em' }}
                    component={SelectionControlGroup}
                    type="checkbox"
                    id="controlGroupCheckbox"
                    name="properties.methods"
                    label={<span>HTTP Methods<span>*</span></span>}
                    controls={httpMethods}
                  />
                  <HelpText message="* at least one http method is required" />
                </Col>
                <Col flex={6} xs={12}>
                  <RateLimit
                    rateLimitToggledName="properties.plugins.rateLimit.enabled"
                    perMinuteName="properties.plugins.rateLimit.perMinute"
                    isToggled={values.properties.plugins.rateLimit && values.properties.plugins.rateLimit.enabled}
                  />
                </Col>
                <Col flex={4} xs={12}>
                  <Security
                    enabledName="properties.plugins.gestaltSecurity.enabled"
                    {...props}
                  />
                </Col>
              </Row>
            </Row>
          </CardText>
        </Col>
      </Row>
    </form>
  );
};

APIEndpointForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  apiEndpoint: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  apiEndpointPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  apiEndpointUpdatePending: PropTypes.bool,
  fetchLambdasDropDown: PropTypes.func.isRequired,
  fetchContainersDropDown: PropTypes.func.isRequired,
  lambdasDropDown: PropTypes.array.isRequired,
  containersDropDown: PropTypes.array.isRequired,
  lambdasDropDownPending: PropTypes.bool,
  containersDropDownPending: PropTypes.bool,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};

APIEndpointForm.defaultProps = {
  lambdasDropDownPending: false,
  containersDropDownPending: false,
  apiEndpointUpdatePending: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
};

export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state),
  })
)(APIEndpointForm);

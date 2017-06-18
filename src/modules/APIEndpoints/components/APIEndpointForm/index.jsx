import React from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues, change } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Autocomplete from 'react-md/lib/Autocompletes';
import Checkbox from 'components/Checkbox';
import SelectField from 'components/SelectField';
import SelectionControlGroup from 'components/SelectionControlGroup';
import TextField from 'components/TextField';
import Breadcrumbs from 'modules/Breadcrumbs';
import { Button } from 'components/Buttons';
import HelpText from 'components/HelpText';
// import authTypes from '../../lists/authTypes';
import RateLimit from '../RateLimit';
import httpMethods from '../../lists/httpMethods';
import implementationTypes from '../../lists/implementationTypes';

const APIEndpointForm = (props) => {
  const {
    form,
    reset,
    values,
    dispatch,
    params,
    pending,
    apiEndpointUpdatePending,
    onSubmit,
    invalid,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    editMode,
    apiEndpoint,
    fetchLambdasDropDown,
    fetchContainersDropDown,
    lambdasDropDown,
    containersDropDown,
    lambdasDropDownPending,
    containersDropDownPending,
  } = props;

  const backLink = `${params.fqon}/hierarchy/${params.workspaceId}/environments/${params.environmentId}/apis/${params.apiId}/edit`;

  // TODO: implement selectors
  const containerPorts = () => {
    const container = containersDropDown.find(cont => cont.id === values.properties.implementation_id);
    return container && container.properties && container.properties.port_mappings;
  };

  const fetchContainers = () => {
    props.dispatch(change(props.form, 'properties.container_port_name', ''));
    fetchContainersDropDown(params.fqon, params.environmentId);
  };

  const handleAutoComplete = (value) => {
    dispatch(change(props.form, 'properties.implementation_id', lambdasDropDown.find(l => l.name === value).id));
  };

  const handleRateLimitToggle = (value) => {
    props.toggleRateLimit(value);
  };

  return (
    <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="flex-row center-center">
        <Card className="flex-10 flex-xs-12 flex-sm-12">
          <CardTitle
            title={
              <div>
                <div>{title}</div>
                <div className="md-caption"><Breadcrumbs />&nbsp;/&nbsp;
                  <Link
                    className="md-caption"
                    style={{ textDecoration: 'none' }}
                    to={{
                      pathname: backLink
                    }}
                  >
                    APIS
                  </Link><span> / Endpoint</span></div>
              </div>
            }
            subtitle={apiEndpoint.id ? apiEndpoint.id : null}
          />
          <CardText>
            <div className="flex-row">
              <Field
                id="endpoint-type"
                className="flex-2 flex-xs-6"
                component={SelectField}
                name="properties.implementation_type"
                menuItems={implementationTypes}
                itemLabel="name"
                itemValue="value"
                required
                label="Type"
                disabled={editMode}
                onChange={() => reset()}
              />
              {/* <Field
                id="auth-type"
                className="flex-2 flex-xs-6"
                component={SelectField}
                name="properties.auth_type.type"
                menuItems={authTypes}
                itemLabel="name"
                itemValue="value"
                required
                label="Auth Type"
              /> */}
              <Field
                className="flex-5 flex-xs-12"
                component={TextField}
                name="properties.resource"
                label="Resource Path"
                type="text"
                required
                helpText="ex: /path or /path1/path2"
              />
              {values.properties.implementation_type === 'container' &&
                <Field
                  id="containers-dropdown"
                  className="flex-3 flex-xs-12"
                  component={SelectField}
                  name="properties.implementation_id"
                  menuItems={containersDropDown}
                  itemLabel="name"
                  itemValue="id"
                  required
                  label="Container"
                  onFocus={() => fetchContainers()}
                  async
                  helpText="container from the current environment"
                />}
              {values.properties.implementation_type === 'lambda' &&
                <div className="flex-3 flex-sm-6 flex-xs-12">
                  <Autocomplete
                    id="lambdas-dropdown"
                    data={lambdasDropDown}
                    dataLabel="name"
                    dataValue="id"
                    label="Search Lambdas"
                    clearOnAutocomplete
                    onClick={() => fetchLambdasDropDown(params.fqon)}
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
                </div>}
              {values.properties.implementation_type === 'lambda' &&
                <Field
                  className="flex-2 flex-xs-6"
                  id="synchronous"
                  component={Checkbox}
                  name="properties.synchronous"
                  // TODO: Find out why redux-form state for bool doesn't apply
                  checked={values.properties.synchronous}
                  label="Synchronous"
                />}
              {values.properties.implementation_type === 'container' &&
                <Field
                  id="container-ports-dropdown"
                  className="flex-2 flex-xs-12"
                  component={SelectField}
                  name="properties.container_port_name"
                  menuItems={containerPorts()}
                  itemLabel="name"
                  itemValue="name"
                  required
                  label="Container Port Name"
                />}
              <div className="flex-row">
                <div className="flex-6 flex-xs-12">
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
                </div>

                <RateLimit
                  className="flex-6 flex-xs-12"
                  rateLimitToggledName="properties.rateLimit.toggled"
                  perMinuteName="properties.rateLimit.perMinute"
                  isToggled={editMode && values.properties.rateLimit}
                  onToggledState={value => handleRateLimitToggle(value)}
                />
              </div>

              {/* <Field
                className="flex-6 flex-xs-12"
                component={TextField}
                name="properties.implementation.function"
                label="Function"
                type="text"
                required
              /> */}
            </div>
          </CardText>
          {(apiEndpointUpdatePending || pending) && <LinearProgress id="apiEndpoint-form" />}
          <CardActions>
            <Button
              flat
              label={cancelLabel}
              disabled={pending || submitting}
              component={Link}
              to={{
                pathname: backLink
              }}
            />
            <Button
              raised
              label={submitLabel}
              type="submit"
              disabled={pristine || pending || lambdasDropDownPending || containersDropDownPending || invalid || submitting}
              primary
            />
          </CardActions>
        </Card>
      </div>
    </form>
  );
};

APIEndpointForm.propTypes = {
  toggleRateLimit: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  apiEndpoint: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
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
  editMode: PropTypes.bool,
};

APIEndpointForm.defaultProps = {
  lambdasDropDownPending: false,
  containersDropDownPending: false,
  apiEndpointUpdatePending: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state),
  })
)(APIEndpointForm);

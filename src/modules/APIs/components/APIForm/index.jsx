import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import Breadcrumbs from 'modules/Breadcrumbs';
import APIListing from 'modules/APIEndpoints';
import { nameMaxLen } from '../../validations';

const APIForm = (props) => {
  const {
    values,
    params,
    pending,
    apiUpdatePending,
    api,
    onSubmit,
    touched,
    error,
    invalid,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    // editMode,
  } = props;

  const selectedProviderLocations = () => {
    const selectedProvider = props.providers.find(provider => provider.id === values.properties.provider.id) || { properties: { locations: [{ id: '', name: 'No Locations Available' }] } };
    // TODO: filter locations by KONG typeId
    return selectedProvider.properties && selectedProvider.properties.locations.map(locations => locations);
  };

  return (
    <div>
      <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle
              title={
                <div>
                  <div>{title}</div>
                  <div className="md-caption"><Breadcrumbs /> / APIS</div>
                </div>
              }
              subtitle={api.id ? api.id : null}
            />
            <CardText>
              <div className="flex-row">
                <Field
                  id="select-provider"
                  className="flex-4 flex-xs-12"
                  component={SelectField}
                  name="properties.provider.id"
                  required
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  errorText={props.touched && props.error}
                  menuItems={props.providers}
                  onFocus={() => props.fetchProvidersByType(params.fqon, params.environmentId, 'environments', 'GatewayManager')}
                />
                <Field
                  id="select-location"
                  className="flex-4 flex-xs-12"
                  component={SelectField}
                  name="properties.provider.location"
                  required
                  label="Location"
                  itemLabel="name"
                  itemValue="name"
                  errorText={props.touched && props.error}
                  menuItems={selectedProviderLocations()}
                />
                <Field
                  className="flex-4 flex-xs-12"
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  errorText={touched && error}
                  maxLength={nameMaxLen}
                  autoComplete="none"
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                />
              </div>
            </CardText>
            {pending || apiUpdatePending ? <LinearProgress id="api-form" /> : null}
            <CardActions>
              <Button
                flat
                label={cancelLabel}
                disabled={pending || submitting}
                component={Link}
                to={`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`}
              />
              <Button
                raised
                label={submitLabel}
                type="submit"
                disabled={pristine || pending || invalid || submitting}
                primary
              />
            </CardActions>
          </Card>

          {api.id ?
            <div className="flex-row center-center">
              <div className="flex-10 flex-xs-12 flex-sm-12">
                <APIListing {...props} />
              </div>
            </div>
            : null}
        </div>
      </form>
    </div>
  );
};

APIForm.propTypes = {
  values: PropTypes.object.isRequired,
  providers: PropTypes.array.isRequired,
  fetchProvidersByType: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  apiUpdatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};

APIForm.defaultProps = {
  touched: false,
  error: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state)
  })
)(APIForm);

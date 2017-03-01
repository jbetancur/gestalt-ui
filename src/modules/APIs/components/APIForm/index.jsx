import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Field } from 'redux-form';
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

  const fetchProviders = () => {
    props.fetchProviders(params.fqon, params.environmentId, 'GatewayManager');
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
                  className="flex-3 flex-xs-12"
                  component={SelectField}
                  name="properties.provider.id"
                  required
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  errorText={props.touched && props.error}
                  menuItems={props.providers}
                  onFocus={() => fetchProviders()}
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
                  lineDirection="center"
                  autoComplete="none"
                />
                <Field
                  className="flex-5 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  lineDirection="center"
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
  providers: PropTypes.array.isRequired,
  fetchProviders: PropTypes.func.isRequired,
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

export default APIForm;

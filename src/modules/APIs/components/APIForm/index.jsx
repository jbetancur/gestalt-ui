import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, getFormValues } from 'redux-form';
// import { metaConstants } from 'modules/MetaResource';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { APIEndpoints } from 'modules/APIEndpoints';
import { Button } from 'components/Buttons';
import { nameMaxLen } from '../../validations';

const APIForm = (props) => {
  const {
    // values,
    match,
    apiPending,
    apiUpdatePending,
    api,
    onSubmit,
    invalid,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    editMode,
  } = props;

  return (
    <div>
      <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle
              title={title}
              subtitle={api.id}
            />
            <CardText>
              <div className="flex-row">
                <Field
                  id="select-provider"
                  className="flex-4 flex-xs-12"
                  component={SelectField}
                  name="properties.provider.locations"
                  required
                  label="Provider"
                  itemLabel="name"
                  itemValue="id"
                  menuItems={props.providersKongByGateway}
                  async
                  onFocus={() => props.fetchProviderKongsByGateway(match.params.fqon, match.params.environmentId, 'environments')}
                  disabled={editMode}
                />
                {/* {values.properties.provider.id ?
                  <Field
                    id="select-location"
                    className="flex-4 flex-xs-12"
                    component={SelectField}
                    name="properties.provider.locations"
                    required
                    label="Location"
                    itemLabel="name"
                    itemValue="id"

                    menuItems={selectedProviderLocations()}
                  /> : null} */}
                <div className="flex-row">
                  <Field
                    className="flex-4 flex-xs-12"
                    component={TextField}
                    name="name"
                    label="Name"
                    type="text"
                    required
                    maxLength={nameMaxLen}
                    disabled={editMode}
                  />
                  <Field
                    className="flex-8 flex-xs-12"
                    component={TextField}
                    name="description"
                    label="Description"
                    type="text"
                  />
                </div>
              </div>
            </CardText>
            {(apiPending || apiUpdatePending) && <LinearProgress id="api-form" />}
            <CardActions>
              <Button
                flat
                label={cancelLabel}
                disabled={apiPending || submitting}
                component={Link}
                to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`}
              />
              <Button
                raised
                label={submitLabel}
                type="submit"
                disabled={pristine || apiPending || apiUpdatePending || invalid || submitting}
                primary
              />
            </CardActions>
          </Card>

          {api.id ?
            <div className="flex-row center-center">
              <div className="flex-10 flex-xs-12 flex-sm-12">
                <APIEndpoints {...props} />
              </div>
            </div>
            : null}
        </div>
      </form>
    </div>
  );
};

APIForm.propTypes = {
  // values: PropTypes.object.isRequired,
  providersKongByGateway: PropTypes.array.isRequired,
  fetchProviderKongsByGateway: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  apiPending: PropTypes.bool.isRequired,
  apiUpdatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool
};

APIForm.defaultProps = {
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

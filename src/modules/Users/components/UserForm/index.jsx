import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import Breadcrumbs from 'modules/Breadcrumbs';
import { usernameMaxLen } from '../../validations';

const UserForm = (props) => {
  const goBack = () => {
    props.router.push(`${props.params.fqon}/users`);
  };

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle
              title={
                <div>
                  <div>{props.title}</div>
                  <div className="md-caption"><Breadcrumbs /> / User</div>
                </div>
              }
              subtitle={props.user.id}
            />
            <CardText>
              <div className="flex-row">
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="name"
                  label="Username"
                  type="text"
                  required
                  maxLength={usernameMaxLen}
                  autoComplete="none"
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.password"
                  label="Password"
                  type="text"
                  required
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.firstName"
                  label="First Name"
                  type="text"
                  required
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.lastName"
                  label="Last Name"
                  type="text"
                  required
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.email"
                  label="Email"
                  type="email"
                  required
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.phoneNumber"
                  label="Phone Number"
                  type="text"
                  required
                />
                <Field
                  id="select-gestalt-home"
                  className="flex-6 flex-xs-12"
                  component={SelectField}
                  name="properties.gestalt_home"
                  menuItems={props.organizations}
                  required
                  itemLabel="name"
                  itemValue="value"
                  label="Gestalt Home"
                  async
                  onFocus={() => props.fetchAllOrgsDropDown(props.params.fqon)}
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
            {(props.updatePending || props.pending) && <LinearProgress id="user-form" />}
            <CardActions>
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.pending || props.submitting}
                onClick={() => goBack()}
              />
              <Button
                raised
                label={props.submitLabel}
                type="submit"
                disabled={props.pristine || props.pending || props.invalid || props.submitting}
                primary
              />
            </CardActions>
          </Card>
        </div>
      </form>
    </div>
  );
};

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  organizations: PropTypes.array.isRequired,
  pending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fetchAllOrgsDropDown: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  updatePending: PropTypes.bool,
};

UserForm.defaultProps = {
  updatePending: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
};

export default UserForm;

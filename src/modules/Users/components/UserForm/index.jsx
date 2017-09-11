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
import PreventAutoFill from 'components/PreventAutoFill';
import { usernameMaxLen } from '../../validations';

const UserForm = (props) => {
  const goBack = () => {
    props.history.push(`/${props.match.params.fqon}/hierarchy`);
  };

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle
              title={props.title}
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
                />
                <PreventAutoFill />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="properties.password"
                  placeholder={props.user.id && 'Reset Password'}
                  label={props.user.id ? 'Reset Password' : 'New Password'}
                  type="password"
                  required={!props.user.id}
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
                />
                <Field
                  id="select-gestalt-home"
                  className="flex-6 flex-xs-12"
                  component={SelectField}
                  name="properties.gestalt_home"
                  menuItems={props.allOrganizationsDropDown}
                  required
                  itemLabel="name"
                  itemValue="value"
                  label="Gestalt Home"
                  async
                  onFocus={() => props.fetchAllOrgsDropDown(props.match.params.fqon)}
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
            {(props.userUpdatePending || props.userPending) && <LinearProgress id="user-form" />}
            <CardActions>
              <Button
                flat
                disabled={props.userPending || props.submitting}
                onClick={() => goBack()}
              >
                {props.cancelLabel}
              </Button>
              <Button
                raised
                type="submit"
                disabled={props.pristine || props.userPending || props.userUpdatePending || props.invalid || props.submitting}
                primary
              >
                {props.submitLabel}
              </Button>
            </CardActions>
          </Card>
        </div>
      </form>
    </div>
  );
};

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  allOrganizationsDropDown: PropTypes.array.isRequired,
  userPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fetchAllOrgsDropDown: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  userUpdatePending: PropTypes.bool,
};

UserForm.defaultProps = {
  userUpdatePending: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
};

export default UserForm;

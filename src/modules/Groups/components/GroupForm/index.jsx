import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Field } from 'redux-form';
import styled from 'styled-components';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from 'components/TextField';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import CardSubHeader from 'components/CardSubHeader';
import FontIcon from 'react-md/lib/FontIcons';
import TextFieldMD from 'react-md/lib/TextFields';
import Breadcrumbs from 'modules/Breadcrumbs';
import { Button } from 'components/Buttons';
import { differenceBy, debounce } from 'lodash';
import { nameMaxLen } from '../../validations';

const MembersList = styled(List)`
  height: 20em;
  box-shadow: none;
  overflow: auto;
  border: 1px solid #f5f5f5;
`;

const GroupForm = (props) => {
  const {
    submitLabel,
    cancelLabel,
    params,
    group,
    updatedGroup,
    users,
    addGroupMember,
    removeGroupMember,
    clearAvailableUsersFilter,
    clearMemberUsersFilter,
    editMode,
    updatePending,
    pristine,
    invalid,
    pending,
    submitting,
    availableUsersFilter
  } = props;
  // replace the group context if the groupMembers (properties.users) has been updated
  // we have to be tricksy due to reacts immutable nature
  // TODO: Ugly, but when a group is created, the ui reroutes to group edit and reloads this data, thus editMode=true
  // This allows us to use the current data model
  const currentGroup = editMode && updatedGroup.id ? updatedGroup : group;
  let membersUserList = currentGroup.properties.users ? currentGroup.properties.users.slice() : [];
  membersUserList = membersUserList.filter(val => val.name.includes(props.memberUsersFilter.filterText));

  const onSuccess = () => clearAvailableUsersFilter();

  const addUser = (user) => {
    addGroupMember(params.fqon, group.id, user.id, onSuccess);
  };

  const removeUser = (user) => {
    removeGroupMember(params.fqon, group.id, user.id, onSuccess);
  };

  // prevents multiple clicks from throwing a RACE - so we use these on the ListItem
  const removeUserDebounced = debounce(removeUser, 250);
  const addUserDebounced = debounce(addUser, 250);

  const filterAvailableUsers = (value) => {
    props.filterAvailableUsers(value);
  };

  const filterMemberUsers = (value) => {
    props.filterMemberUsers(value);
  };

  /* filter out users that are already members */
  const generateAvailableUsers = () => (
    differenceBy(users, currentGroup.properties.users, 'id').map(user =>
      (<ListItem
        key={user.id}
        primaryText={user.name}
        rightIcon={<FontIcon>add_circle</FontIcon>}
        inkDisabled
        disabled={updatePending}
        onClick={() => addUserDebounced(user)}
      />))
  );

  const generateMemberUsers = () => (
    membersUserList.map(user => (
      <ListItem
        key={user.id}
        primaryText={user.name}
        rightIcon={<FontIcon>remove_circle</FontIcon>}
        inkDisabled
        disabled={updatePending}
        onClick={() => removeUserDebounced(user)}
      />)
    )
  );

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle
              title={
                <div>
                  <div>{props.title}</div>
                  <div className="md-caption"><Breadcrumbs /> / Group</div>
                </div>
              }
              subtitle={group.id}
            />
            <CardText>
              <div className="flex-row">
                <Field
                  className="flex-4 flex-xs-12"
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  maxLength={nameMaxLen}
                />
                <Field
                  className="flex-8 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                />
              </div>
            </CardText>
            {(updatePending || pending) && <LinearProgress id="group-form" />}
            <CardActions>
              <Button
                flat
                label={cancelLabel}
                disabled={updatePending || pending || submitting}
                component={Link}
                to={`${params.fqon}/groups`}
              />
              <Button
                raised
                label={submitLabel}
                type="submit"
                disabled={pristine || updatePending || pending || invalid || submitting}
                primary
              />
            </CardActions>
          </Card>
        </div>
      </form>

      {editMode &&
      <div className="flex-row">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            {props.updateMembersPending && <LinearProgress id="group-members" />}
            <div className="flex-row">
              <div className="flex-6 flex-xs-12">
                <h3>Available Users</h3>
                <MembersList>
                  <CardSubHeader
                    primaryText={<TextFieldMD
                      id="filter-users-remove"
                      label="filter available users"
                      leftIcon={<FontIcon>filter_list</FontIcon>}
                      rightIcon={<Button icon onClick={() => clearAvailableUsersFilter()}><FontIcon>clear</FontIcon></Button>}

                      value={availableUsersFilter.filterText}
                      onChange={value => filterAvailableUsers(value)}
                    />}
                  />
                  {generateAvailableUsers()}
                </MembersList>
              </div>
              <div className="flex-6 flex-xs-12">
                <h3>Members</h3>
                <MembersList>
                  <CardSubHeader
                    primaryText={<TextFieldMD
                      id="filter-users-remove"
                      label="filter members"
                      leftIcon={<FontIcon>filter_list</FontIcon>}
                      rightIcon={<Button icon onClick={() => clearMemberUsersFilter()}><FontIcon>clear</FontIcon></Button>}

                      value={props.memberUsersFilter.filterText}
                      onChange={value => filterMemberUsers(value)}
                    />}
                  />
                  {generateMemberUsers()}
                </MembersList>
              </div>
            </div>
          </Card>
        </div>
      </div>}
    </div>
  );
};

GroupForm.propTypes = {
  group: PropTypes.object.isRequired,
  updatedGroup: PropTypes.object,
  users: PropTypes.array.isRequired,
  addGroupMember: PropTypes.func.isRequired,
  clearAvailableUsersFilter: PropTypes.func.isRequired,
  removeGroupMember: PropTypes.func.isRequired,
  clearMemberUsersFilter: PropTypes.func.isRequired,
  availableUsersFilter: PropTypes.object,
  memberUsersFilter: PropTypes.object,
  params: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
  updatePending: PropTypes.bool.isRequired,
  updateMembersPending: PropTypes.bool,
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

GroupForm.defaultProps = {
  updatedGroup: {},
  updateMembersPending: false,
  availableUsersFilter: {},
  memberUsersFilter: {},
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

export default GroupForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
    match,
    group,
    groupUpdated,
    users,
    addGroupMember,
    removeGroupMember,
    clearAvailableUsersFilter,
    clearMemberUsersFilter,
    editMode,
    groupUpdatePending,
    pristine,
    invalid,
    groupPending,
    submitting,
    availableUsersFilter,
    filterAvailableUsers,
    filterMemberUsers,
  } = props;
  // replace the group context if the groupMembers (properties.users) has been updated
  // we have to be tricksy due to reacts immutable nature
  // TODO: Ugly, but when a group is created, the ui reroutes to group edit and reloads this data, thus editMode=true
  // This allows us to use the current data model
  const currentGroup = editMode && groupUpdated.id ? groupUpdated : group;
  let membersUserList = currentGroup.properties.users ? currentGroup.properties.users.slice() : [];
  membersUserList = membersUserList.filter(val => val.name.includes(props.memberUsersFilter.filterText));

  const onSuccess = () => clearAvailableUsersFilter();

  const addUser = (user) => {
    addGroupMember(match.params.fqon, group.id, user.id, onSuccess);
  };

  const removeUser = (user) => {
    removeGroupMember(match.params.fqon, group.id, user.id, onSuccess);
  };

  // prevents multiple clicks from throwing a RACE - so we use these on the ListItem
  const removeUserDebounced = debounce(removeUser, 250);
  const addUserDebounced = debounce(addUser, 250);

  /* filter out users that are already members */
  const generateAvailableUsers = () => (
    differenceBy(users, currentGroup.properties.users, 'id').map(user =>
      (<ListItem
        key={user.id}
        primaryText={user.name}
        rightIcon={<FontIcon>add_circle</FontIcon>}
        inkDisabled
        disabled={groupUpdatePending}
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
        disabled={groupUpdatePending}
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
              title={props.title}
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
            {(groupUpdatePending || groupPending) && <LinearProgress id="group-form" />}
            <CardActions>
              <Button
                flat
                disabled={groupUpdatePending || groupPending || submitting}
                component={Link}
                to={`/${match.params.fqon}/hierarchy`}
              >
                {cancelLabel}
              </Button>
              <Button
                raised
                type="submit"
                disabled={pristine || groupUpdatePending || groupPending || invalid || submitting}
                primary
              >
                {submitLabel}
              </Button>
            </CardActions>
          </Card>
        </div>
      </form>

      {editMode &&
      <div className="flex-row">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            {props.groupMembersPending && <LinearProgress id="group-members" />}
            <div className="flex-row">
              <div className="flex-6 flex-xs-12">
                <h3>Available Users</h3>
                <MembersList>
                  <CardSubHeader
                    primaryText={<TextFieldMD
                      id="filter-users-remove"
                      label="filter available users"
                      leftIcon={<FontIcon>filter_list</FontIcon>}
                      rightIcon={<Button icon iconChildren="clear" onClick={() => clearAvailableUsersFilter()} />}

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
                      rightIcon={<Button icon iconChildren="clear" onClick={() => clearMemberUsersFilter()} />}

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
  filterAvailableUsers: PropTypes.func.isRequired,
  filterMemberUsers: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  groupUpdated: PropTypes.object,
  users: PropTypes.array.isRequired,
  addGroupMember: PropTypes.func.isRequired,
  clearAvailableUsersFilter: PropTypes.func.isRequired,
  removeGroupMember: PropTypes.func.isRequired,
  clearMemberUsersFilter: PropTypes.func.isRequired,
  availableUsersFilter: PropTypes.object,
  memberUsersFilter: PropTypes.object,
  match: PropTypes.object.isRequired,
  groupPending: PropTypes.bool.isRequired,
  groupUpdatePending: PropTypes.bool.isRequired,
  groupMembersPending: PropTypes.bool,
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
  groupUpdated: {},
  groupMembersPending: false,
  availableUsersFilter: {},
  memberUsersFilter: {},
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

export default GroupForm;

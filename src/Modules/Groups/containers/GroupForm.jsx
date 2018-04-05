import React from 'react';
import PropTypes from 'prop-types';
import { differenceBy, debounce } from 'lodash';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import styled from 'styled-components';
import { List, ListItem, FontIcon, TextField as TextFieldMD } from 'react-md';
import { ActivityContainer } from 'components/ProgressIndicators';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import ActionsToolbar from 'components/ActionsToolbar';
import { FullPageFooter } from 'components/FullPage';
import { TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import Form from 'components/Form';
import CardSubHeader from '../components/CardSubHeader';
import { nameMaxLen } from '../validations';

const MembersList = styled(List)`
  height: 20em;
  box-shadow: none;
  overflow: auto;
  border: 1px solid #F5F5F5;
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
    <Row gutter={5} center>
      <Col flex={10} xs={12} sm={12} md={12}>
        <Form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off" disabled={groupUpdatePending || groupPending}>
          <ActionsToolbar title={props.title} />
          {(groupUpdatePending || groupPending) && <ActivityContainer id="group-form" />}
          <Row gutter={5}>
            {editMode &&
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={group} />
                </Panel>
              </Col>}
            <Col flex={12}>
              <Panel title="General" expandable={false}>
                <Row gutter={5}>
                  <Col flex={4} xs={12}>
                    <Field
                      component={TextField}
                      name="name"
                      label="Name"
                      type="text"
                      required
                      maxLength={nameMaxLen}
                    />
                  </Col>
                  <Col flex={8} xs={12}>
                    <Field
                      component={TextField}
                      name="description"
                      label="Description"
                      type="text"
                    />
                  </Col>
                </Row>
              </Panel>
            </Col>
          </Row>

          <FullPageFooter>
            <Button
              flat
              iconChildren="arrow_back"
              disabled={groupUpdatePending || groupPending || submitting}
              component={Link}
              to={`/${match.params.fqon}/groups`}
            >
              {cancelLabel}
            </Button>
            <Button
              raised
              iconChildren="save"
              type="submit"
              disabled={pristine || groupUpdatePending || groupPending || invalid || submitting}
              primary
            >
              {submitLabel}
            </Button>
          </FullPageFooter>
        </Form>

        {props.groupMembersPending && <ActivityContainer id="group-members" />}

        {editMode &&
          <Row gutter={5}>
            <Col flex={6} xs={12}>
              <Panel title="Available Users" expandable={false}>
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
              </Panel>
            </Col>

            <Col flex={6} xs={12}>
              <Panel title="Members" expandable={false}>
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
              </Panel>
            </Col>
          </Row>}
      </Col>
    </Row>
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexybox';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import AutoComplete from 'components/Fields/AutoComplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import IconButton from 'components/Buttons';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import jsonPatch from 'fast-json-patch';
import GroupForm from './GroupForm';
import validate from '../validations';
import { getEditGroupModel } from '../selectors';
import withGroup from '../hocs/withGroup';
import withUsers from '../../Users/hocs/withUsers';

class GroupEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    usersPending: PropTypes.bool.isRequired,
    usersActions: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    groupPending: PropTypes.bool.isRequired,
    groupMembersPending: PropTypes.bool.isRequired,
    groupActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.populateGroup();
    this.populateUsers();
  }

  populateGroup(noPending) {
    const { match, groupActions } = this.props;

    groupActions.fetchGroup({ fqon: match.params.fqon, id: match.params.groupId, noPending });
  }

  populateUsers() {
    const { match, usersActions } = this.props;

    usersActions.fetchUsers({ fqon: match.params.fqon });
  }

  addUser = (value) => {
    const { match, group, groupActions } = this.props;
    const isDupe = value.value && this.props.group.properties.users.find(item => item.id === value.value);

    if (!isDupe) {
      groupActions.addGroupMember({
        fqon: match.params.fqon,
        groupId: group.id,
        userId: value.value,
        onSuccess: () => this.populateGroup(true),
      });
    }
  };

  removeUser = (id) => {
    const { match, group, groupActions } = this.props;
    groupActions.removeGroupMember({
      fqon: match.params.fqon,
      groupId: group.id,
      userId: id,
      onSuccess: () => this.populateGroup(true),
    });
  };

  update = (values) => {
    const { match, group, groupActions } = this.props;
    const { name, description } = group;

    const originalModel = {
      name,
      description
    };

    const model = {
      name: values.name,
      description: values.description
    };

    const payload = jsonPatch.compare(originalModel, model);
    groupActions.updateGroup({ fqon: match.params.fqon, id: group.id, payload });
  }

  generateMemberUsers() {
    const { group, groupPending, groupMembersPending } = this.props;

    return (
      group.properties.users && group.properties.users.map(user => (
        <ListItem
          key={user.id}
          disabled={groupPending || groupMembersPending}
        >
          <ListItemText primary={user.name} />
          <ListItemSecondaryAction>
            <RemoveIcon
              fontSize="small"
              color="ACTION"
              onClick={() => this.removeUser(user.id)}
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
          </ListItemSecondaryAction>
        </ListItem>)
      )
    );
  }

  render() {
    const { match, initialFormValues, group, groupPending, groupMembersPending, users, usersPending } = this.props;

    return (
      groupPending && !group.id ?
        <ActivityContainer id="group-loading" /> :
        <Row center>
          <Col flex={8} xs={12} sm={12} md={12}>
            <ActionsToolbar
              title={group.name}
              sticky
              showBackNav
              navTo={`/${match.params.fqon}/groups`}
            />

            {(groupPending || groupMembersPending) && <ActivityContainer id="group-form" />}

            <Row gutter={5}>
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={group} />
                </Panel>
              </Col>
            </Row>

            <FinalForm
              editMode
              initialValues={initialFormValues}
              validate={validate}
              onSubmit={this.update}
              onAddUser={this.addUser}
              onRemoveUser={this.removeUser}
              render={({ handleSubmit, submitting, pristine, ...rest }) => (
                <Form
                  onSubmit={handleSubmit}
                  submitTitle="Update"
                  disabled={groupPending}
                  disabledSubmit={groupPending || submitting}
                  noFooterPadding
                >
                  <GroupForm {...rest} />
                </Form>
              )}
            />

            <Row gutter={5} paddingBottom="52px">
              <Col flex={12}>
                <Panel title="Group Members" expandable={false} noPadding>
                  <Row paddingLeft="16px" paddingRight="16px">
                    <Col flex={12}>
                      <AutoComplete
                        id="group-members-dropdown"
                        data={users}
                        label="Add Member"
                        dataLabel="name"
                        dataValue="id"
                        onMenuOpen={() => this.populateUsers()}
                        onSelected={this.addUser}
                        isLoading={usersPending}
                        noOptionsMessage={() => 'no users found'}
                        helpText="search for a user"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col flex={12}>
                      <List>
                        {this.generateMemberUsers()}
                      </List>
                    </Col>
                  </Row>
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getEditGroupModel(state),
});

export default compose(
  withGroup(),
  withUsers(),
  connect(mapStateToProps),
)(GroupEdit);

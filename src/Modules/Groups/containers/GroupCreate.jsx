import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import { Row, Col } from 'react-flexybox';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import GroupForm from './GroupForm';
import validate from '../validations';
import groupModel from '../models/group';
import withGroup from '../hocs/withGroup';
import withUsers from '../../Users/hocs/withUsers';

const initialFormValues = groupModel.create();

class GroupCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    groupPending: PropTypes.bool.isRequired,
    groupActions: PropTypes.object.isRequired,
    usersActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, usersActions } = this.props;

    usersActions.fetchUsers({ fqon: match.params.fqon });
  }

  create = (values) => {
    const { match, history, groupActions } = this.props;
    const onSuccess = response => history.replace(`/${match.params.fqon}/groups/${response.id}`);

    groupActions.createGroup({ fqon: match.params.fqon, payload: values, onSuccess });
  }

  render() {
    const { match, groupPending } = this.props;

    return (
      <Row center>
        <Col flex={8} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a Group" />

          {groupPending && <ActivityContainer id="group-form" />}

          <FinalForm
            initialValues={initialFormValues}
            validate={validate}
            onSubmit={this.create}
            render={({ handleSubmit, submitting, ...rest }) => (
              <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                disabled={groupPending}
                disabledSubmit={groupPending || submitting}
                submitTitle="Create"
                showCancel
                cancelTo={`/${match.params.fqon}/groups`}
              >
                <GroupForm {...rest} />
              </Form>
            )}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withUsers(),
  withGroup(),
)(GroupCreate);

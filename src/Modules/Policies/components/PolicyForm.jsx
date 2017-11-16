import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import { Card, CardTitle, CardText, LinearProgress, MenuButton, ListItem } from 'react-md';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { PolicyRules } from 'Modules/PolicyRules';
import { nameMaxLen } from '../validations';
import policyTypes from '../lists/policyTypes';

const PolicyForm = (props) => {
  const {
    match,
    policyPending,
    policy,
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

  const ruleTypes = () => (
    policyTypes.map(type => (
      <ListItem
        key={type.value}
        primaryText={type.displayName}
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}/rules/create${type.name}Rule`}
      />)
    ));

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      {policy.id &&
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12}>
            <DetailsPane model={policy} />
          </Col>
        </Row>}
      <Row gutter={5} center>
        <Col component={Card} flex={10} xs={12} sm={12}>
          <CardTitle title={title} />
          <ActionsToolbar>
            <Button
              flat
              iconChildren="arrow_back"
              disabled={policyPending || submitting}
              component={Link}
              to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies`}
            >
              {cancelLabel}
            </Button>
            <Button
              raised
              iconChildren="save"
              type="submit"
              disabled={pristine || policyPending || invalid || submitting}
              primary
            >
              {submitLabel}
            </Button>
            {policy.id &&
              <MenuButton
                id="add-policyRule"
                raised
                primary
                position="below"
                menuItems={ruleTypes()}
                iconChildren="playlist_add_check"
                style={{ marginLeft: '.1em' }}
              >
                Add Policy Rule
              </MenuButton>}
          </ActionsToolbar>
          {policyPending && <LinearProgress id="policy-form" />}
          <CardText>
            <Row gutter={5}>
              <Col flex={5} xs={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  maxLength={nameMaxLen}
                  autoComplete="none"
                />
              </Col>
              <Col flex={12}>
                <Panel title="Description" defaultExpanded={!!policy.description}>
                  <Field
                    component={TextField}
                    name="description"
                    placeholder="Description"
                    type="text"
                    rows={1}
                  />
                </Panel>
              </Col>
            </Row>
          </CardText>
        </Col>

        {(editMode && policy.id) &&
          <Row gutter={5} center>
            <Col flex={10} xs={12} sm={12}>
              <PolicyRules {...props} />
            </Col>
          </Row>}
      </Row>
    </form>
  );
};

PolicyForm.propTypes = {
  match: PropTypes.object.isRequired,
  policy: PropTypes.object.isRequired,
  policyPending: PropTypes.bool.isRequired,
  policyUpdatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
};

PolicyForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
};

export default PolicyForm;

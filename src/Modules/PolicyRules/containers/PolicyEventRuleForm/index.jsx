import React from 'react';
import PropTypes from 'prop-types';
import { Field, getFormValues, change } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Autocomplete } from 'react-md';
import { withPickerData } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { FullPageFooter } from 'components/FullPage';
import { Panel } from 'components/Panels';
import { Button } from 'components/Buttons';
import { TextField, Checkbox } from 'components/ReduxFormFields';
import Fieldset from 'components/Fieldset';
import DetailsPane from 'components/DetailsPane';
import Form from 'components/Form';
import policyResourceTypes from '../../lists/policyResourceTypes';

const PolicyEventRuleForm = (props) => {
  const {
    match,
    policyRulePending,
    policyRuleUpdatePending,
    onSubmit,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    selectedActions,
    editMode,
    policyRule,
    lambdasData,
    lambdasLoading,
    fetchlambdasData,
    handleSelectedActions,
    dispatch,
    form,
  } = props;

  const backLink = `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`;

  const policyTriggers = [].concat(...Object.keys(policyResourceTypes).map(key => policyResourceTypes[key].triggers));

  const onActionChecked = (action) => {
    handleSelectedActions(action, selectedActions);
  };

  const handleAutoComplete = (value) => {
    const field = editMode ? 'properties.lambda.id' : 'properties.lambda';

    dispatch(change(form, field, value));
  };

  return (
    <Row gutter={5} center>
      <Col flex={10} xs={12} sm={12} md={12}>
        <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off" disabled={policyRuleUpdatePending || policyRulePending}>
          <ActionsToolbar
            title={title}
            showActions={editMode && policyRule.id}
            actions={[
              <Button
                key="eventRule--entitlements"
                flat
                iconChildren="security"
                onClick={() => props.entitlementActions.showEntitlementsModal(props.title, props.match.params.fqon, policyRule.id, 'rules', 'Event Rule')}
              >
                Entitlements
              </Button>
            ]}
          />

          {(policyRuleUpdatePending || policyRulePending) && <ActivityContainer id="policyRule-form" />}

          <Row gutter={5}>
            {editMode && policyRule.id &&
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={policyRule} />
                </Panel>
              </Col>}

            <Col flex={12}>
              <Panel>
                <Row gutter={5}>
                  <Col flex={4} xs={12} sm={6}>
                    <Field
                      component={TextField}
                      name="name"
                      label="Name"
                      type="text"
                      required
                    />
                  </Col>
                  <Col flex={8} xs={12} sm={6}>
                    <Field
                      component={TextField}
                      name="description"
                      label="Description"
                      type="text"
                    />
                  </Col>
                  <Row gutter={5}>
                    <Col flex={4} sm={6} xs={12}>
                      <Fieldset legend="Lambda">
                        <Autocomplete
                          id="lambdas-dropdown"
                          data={lambdasData}
                          dataLabel="name"
                          dataValue="id"
                          clearOnAutocomplete
                          onClick={() => fetchlambdasData()}
                          onAutocomplete={value => handleAutoComplete(value)}
                          placeholder="Search"
                          helpText="search in the current org by lambda name/uuid, or paste a lambda uuid below"
                        />
                        {/* TODO: needs a custom search control since autocomplete above cannot be validated with redux-form so we do it here */}
                        <Field
                          component={TextField}
                          name={editMode ? 'properties.lambda.id' : 'properties.lambda'}
                          label="Lambda UUID"
                        />
                      </Fieldset>
                    </Col>
                  </Row>
                </Row>
              </Panel>
            </Col>

            <Col flex={12}>
              <Panel title="Triggers" expandable={false}>
                <Row columnDivisions={24}>
                  {policyTriggers.map(action => (
                    <Col flex={6} xs={24} sm={12} md={12} key={action.id}>
                      <Field
                        key={action.name}
                        id={action.name}
                        component={Checkbox}
                        label={action.name}
                        checked={!!selectedActions.find(a => a === action.name)}
                        name="properties.match_actions" // this is just a stub to change form touch state and is not used in the final form values
                        onChange={() => onActionChecked(action.name)}
                        style={{ margin: 0 }}
                      />
                    </Col>))}
                </Row>
              </Panel>
            </Col>
          </Row>

          <FullPageFooter>
            <Button
              flat
              iconChildren="arrow_back"
              disabled={policyRulePending || submitting}
              component={Link}
              to={backLink}
            >
              {cancelLabel}
            </Button>
            <Button
              raised
              iconChildren="save"
              type="submit"
              disabled={pristine || lambdasLoading || policyRulePending || submitting}
              primary
            >
              {submitLabel}
            </Button>
          </FullPageFooter>
        </Form>
      </Col>
    </Row>
  );
};

PolicyEventRuleForm.propTypes = {
  form: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleSelectedActions: PropTypes.func.isRequired,
  policyRule: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  policyRulePending: PropTypes.bool.isRequired,
  policyRuleUpdatePending: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  selectedActions: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
  fetchlambdasData: PropTypes.func.isRequired,
  lambdasData: PropTypes.array.isRequired,
  lambdasLoading: PropTypes.bool.isRequired,
  entitlementActions: PropTypes.object,
};

PolicyEventRuleForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  entitlementActions: {},
  policyRuleUpdatePending: false,
};

export default compose(
  withPickerData({ entity: 'lambdas', label: 'Lambdas', fetchOnMount: false }),
  connect(
    (state, props) => ({
      values: getFormValues(props.form)(state)
    })
  )
)(PolicyEventRuleForm);

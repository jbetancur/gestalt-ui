import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { translate } from 'react-i18next';
import { Col, Row } from 'react-flexybox';
import { DialogContainer } from 'react-md';
import ActivityContainer from 'components/ActivityContainer';
import DotActivity from 'components/DotActivity';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { UnixVariablesForm } from 'Modules/Variables';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import { nameMaxLen, shortNameMaxLen } from '../validations';

const HierarchyForm = (props) => {
  const { t } = props;
  const submitDisabled = props.pristine || props.pending || props.invalid || props.submitting;

  const actions = [
    <Button
      key="contextform--cancel"
      flat
      disabled={props.submitting}
      onClick={props.history.goBack}
    >
      {props.cancelLabel}
    </Button>,
    <Button
      key="contextform--create"
      raised
      type="submit"
      disabled={submitDisabled}
      primary
    >
      {props.pending && !props.editMode ? <DotActivity id="context-form-submit-loading" primary centered size={1} /> : props.submitLabel}
    </Button>,
  ];

  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
      <DialogContainer
        id="context-form-dialog"
        title={!props.pending && props.title}
        visible
        width="60em"
        actions={actions}
      >
        {props.pending && props.editMode ?
          <ActivityContainer primary centered id="context-form--loading" /> :
          <Row gutter={5}>
            <Col flex={6} xs={12}>
              <Field
                component={TextField}
                name="description"
                label={t('containment.fields.description.label')}
                type="text"
                maxLength={nameMaxLen}
                required
                disabled={props.pending}
              />
            </Col>
            <Col flex={6} xs={12}>
              <Field
                component={TextField}
                name="name"
                label={t('containment.fields.name.label')}
                type="text"
                maxLength={shortNameMaxLen}
                required
                helpText={t('containment.fields.name.helpText')}
                disabled={props.pending}
              />
            </Col>
            {props.isEnvironment &&
              <Col flex={6} xs={12}>
                <Field
                  id="environment-type"
                  component={SelectField}
                  name="properties.environment_type"
                  menuItems={['development', 'test', 'production']}
                  required
                  label={t('containment.fields.environmentType.label')}
                  disabled={props.pending}
                />
              </Col>}

            <Col flex={12}>
              <Panel title="Environment Variables" noPadding>
                <FieldArray
                  component={UnixVariablesForm}
                  name="properties.env"
                />
              </Panel>
            </Col>
          </Row>}
      </DialogContainer>
    </form>
  );
};

HierarchyForm.propTypes = {
  history: PropTypes.object.isRequired,
  pending: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  isEnvironment: PropTypes.bool,
  t: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

HierarchyForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  isEnvironment: false,
  pending: false,
  editMode: false,
};

export default translate()(HierarchyForm);

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { VariablesForm } from 'modules/Variables';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import { Button } from 'components/Buttons';
import Fieldset from 'components/Fieldset';
import { isUnixVariable } from 'util/validations';
import { nameMaxLen, shortNameMaxLen } from './validations';

const ActionIconSection = styled.div`
  text-align: right;
`;

const HierarchyForm = (props) => {
  const { t, editMode } = props;

  return (
    <div>
      <ContextNavigation
        breadcrumbComponent={<Breadcrumbs />}
      />
      <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <Row gutter={5} center>
          <Col
            component={Card}
            flex={8}
            xs={12}
            sm={12}
          >
            <CardTitle
              title={props.title}
            />
            <CardText>
              <div className="flex-row">
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="description"
                  label={t('containment.fields.description.label')}
                  type="text"
                  maxLength={nameMaxLen}
                  required
                  disabled={props.pending}
                />
                <Field
                  className="flex-6 flex-xs-12"
                  component={TextField}
                  name="name"
                  label={t('containment.fields.name.label')}
                  type="text"
                  maxLength={shortNameMaxLen}
                  required
                  helpText={t('containment.fields.name.helpText')}
                  disabled={props.pending}
                />
                {props.isEnvironment &&
                <Field
                  id="environment-type"
                  className="flex-6 flex-xs-12"
                  component={SelectField}
                  name="properties.environment_type"
                  menuItems={['development', 'test', 'production']}
                  required
                  label={t('containment.fields.environmentType.label')}
                  disabled={props.pending}
                />}
              </div>
              <Fieldset legend="Environment Variables">
                <VariablesForm
                  icon="add"
                  fieldName="properties.env"
                  keyFieldValidationFunction={isUnixVariable}
                  keyFieldValidationMessage="must be a unix variable name"
                />
              </Fieldset>
            </CardText>
            {props.pending && <LinearProgress id="containment-form" />}
            <Row component={CardActions}>
              <Col flex={10} xs={12}>
                <Button
                  flat
                  disabled={props.submitting}
                  onClick={() => props.history.goBack()}
                >
                  {props.cancelLabel}
                </Button>
                <Button
                  raised
                  type="submit"
                  disabled={props.pristine || props.pending || props.invalid || props.submitting}
                  primary
                >
                  {props.submitLabel}
                </Button>
              </Col>
              <Col component={ActionIconSection} flex={2} xs={12}>
                {editMode &&
                  <Button
                    tooltipLabel="Entitlements"
                    tooltipPosition="top"
                    icon
                    iconChildren="security"
                    onClick={() => props.showEntitlementsModal(props.title, props.match.params)}
                  />}
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </div>
  );
};

HierarchyForm.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
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
  showEntitlementsModal: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

HierarchyForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  isEnvironment: false,
  editMode: false,
};

export default translate()(HierarchyForm);

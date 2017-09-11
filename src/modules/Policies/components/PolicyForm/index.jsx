import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import { PolicyRules } from 'modules/PolicyRules';
import { nameMaxLen } from '../../validations';

const PolicyForm = (props) => {
  const {
    match,
    policyPending,
    policy,
    policyUpdatePending,
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

  return (
    <div>
      <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardTitle
              title={title}
              subtitle={policy.id}
            />
            <CardText>
              <div className="flex-row">
                <Field
                  className="flex-5 flex-xs-12"
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  required
                  maxLength={nameMaxLen}
                  autoComplete="none"
                />
                <Field
                  className="flex-7 flex-xs-12"
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                />
              </div>
            </CardText>
            {(policyUpdatePending || policyPending) && <LinearProgress id="policy-form" />}
            <CardActions>
              <Button
                flat
                disabled={policyPending || submitting}
                component={Link}
                to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`}
              >
                {cancelLabel}
              </Button>
              <Button
                raised
                type="submit"
                disabled={pristine || policyPending || policyUpdatePending || invalid || submitting}
                primary
              >
                {submitLabel}
              </Button>
            </CardActions>
          </Card>

          {(editMode && policy.id) &&
            <Row gutter={5} center>
              <Col flex={10} xs={12} sm={12}>
                <PolicyRules {...props} />
              </Col>
            </Row>}
        </div>
      </form>
    </div>
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

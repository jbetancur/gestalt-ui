import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Form from 'components/Form';
import { Button } from 'components/Buttons';
import { Row, Col } from 'react-flexybox';
import { Panel } from 'components/Panels';
import { UnixVariablesFormNew } from 'Modules/Variables';
import { FullPageFooter } from 'components/FullPage';
import LambdaSection from '../components/LambaSection';
import LambdaFunctionSection from '../components/LambdaFunctionSection';
import LambdaPeriodicSection from '../components/LambdaPeriodicSection';
import LambdaAdvancedSection from '../components/LambdaAdvancedSection';
import LambdaSourceSection from '../components/LambdaSourceSection';

const LambdaForm = ({ handleSubmit, form, values, match, loading, providers, executors, editMode, pristine, submitting }) => (
  <Form
    onSubmit={handleSubmit}
    autoComplete="off"
    disabled={loading}
  >
    <LambdaSection providers={providers} editMode={editMode} />

    <LambdaFunctionSection
      executors={executors}
      formValues={values}
      editMode={editMode}
      form={form}
    />

    {values.properties.code_type === 'code' &&
      <LambdaSourceSection />}

    <Row gutter={5}>
      <Col flex={12}>
        <Panel title="Environment Variables" noPadding count={values.properties.env.length}>
          <UnixVariablesFormNew fieldName="properties.env" formValues={values} />
        </Panel>
      </Col>
    </Row>

    <LambdaPeriodicSection />
    <LambdaAdvancedSection formValues={values} />

    <FullPageFooter>
      <Button
        flat
        iconChildren="arrow_back"
        disabled={loading || submitting}
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/lambdas`}
      >
        Lambdas
      </Button>
      <Button
        raised
        iconChildren="save"
        type="submit"
        disabled={pristine || submitting}
        primary
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    </FullPageFooter>
  </Form>
);

LambdaForm.propTypes = {
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  // lambda: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
  providers: PropTypes.array.isRequired,
  executors: PropTypes.array.isRequired,
};

LambdaForm.defaultProps = {
  editMode: false,
};

export default withRouter(LambdaForm);

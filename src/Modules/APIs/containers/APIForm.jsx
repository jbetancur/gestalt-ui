import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import ActionsToolbar from 'components/ActionsToolbar';
import { FullPageFooter } from 'components/FullPage';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { APIEndpoints } from 'Modules/APIEndpoints';
import { Button } from 'components/Buttons';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import Form from 'components/Form';
import { ActivityContainer } from 'components/ProgressIndicators';

const APIForm = (props) => {
  const {
    match,
    apiPending,
    api,
    onSubmit,
    pristine,
    submitting,
    handleSubmit,
    cancelLabel,
    submitLabel,
    title,
    editMode,
  } = props;

  return (
    <Row gutter={5} center>
      <Col flex={10} xs={12} sm={12} md={12}>
        <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off" disabled={apiPending}>
          <ActionsToolbar
            title={title}
            hideActions={editMode && api.id}
            actions={[
              <Button
                key="add-endpoint"
                flat
                primary
                component={Link}
                to={`${match.url}/apiendpoints/create`}
                iconChildren="link"
              >
                Add Endpoint
              </Button>,
              <Button
                key="api--entitlements"
                flat
                iconChildren="security"
                onClick={() => props.entitlementActions.showEntitlementsModal(props.title, props.match.params.fqon, api.id, 'apis', 'API')}
              >
                Entitlements
              </Button>]}
          />

          {apiPending && <ActivityContainer id="api-form" />}

          <Row gutter={5}>
            {editMode && api.id &&
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={api} />
                </Panel>
              </Col>}
            <Col flex={12}>
              <Panel title="General" expandable={false}>
                <Row gutter={5}>
                  <Col flex={6} xs={12}>
                    <Field
                      id="select-provider"
                      component={SelectField}
                      name="properties.provider.locations"
                      required
                      label="Provider"
                      itemLabel="name"
                      itemValue="id"
                      menuItems={props.providersKongByGateway}
                      async
                      disabled={editMode}
                    />
                  </Col>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="name"
                      label="Name"
                      type="text"
                      required
                      disabled={editMode}
                    />
                  </Col>

                  <Col flex={12}>
                    <Field
                      id="description"
                      component={TextField}
                      name="description"
                      label="Description"
                      rows={1}
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
              disabled={apiPending || submitting}
              component={Link}
              to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis`}
            >
              {cancelLabel}
            </Button>
            <Button
              raised
              iconChildren="save"
              type="submit"
              disabled={pristine || apiPending || submitting}
              primary
            >
              {submitLabel}
            </Button>
          </FullPageFooter>
        </Form>

        {editMode && api.id &&
          <Row gutter={5}>
            <Col flex={12}>
              <APIEndpoints {...props} />
            </Col>
          </Row>}

      </Col>
    </Row>
  );
};

APIForm.propTypes = {
  // values: PropTypes.object.isRequired,
  providersKongByGateway: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  apiPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  editMode: PropTypes.bool,
  entitlementActions: PropTypes.object,
};

APIForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  editMode: false,
  entitlementActions: {},
};

// Connect to this forms state in the store so we can enum the values
export default APIForm;


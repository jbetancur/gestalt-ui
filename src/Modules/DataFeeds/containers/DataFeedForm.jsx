import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Link, withRouter } from 'react-router-dom';
import { ActivityContainer } from 'components/ProgressIndicators';
import { TextField, SelectField, AceEditor, Checkbox } from 'components/ReduxFormFields';
import { Field } from 'react-final-form';
import Form from 'components/Form';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import { Panel } from 'components/Panels';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import feedTypes from '../lists/feedTypes';

const getFormats = (values) => {
  if (values && values.properties && values.properties.kind) {
    const feed = feedTypes.find(f => f.type === values.properties.kind);
    return feed ? feed.formats : [];
  }

  return [];
};

const getMode = (values) => {
  if (values && values.properties && values.properties.data.format) {
    return values.properties.data.format.toUpperCase().includes('JSON') ? 'json' : 'text';
  }

  return null;
};

const showEditor = (values) => {
  if (values && values.properties && values.properties.data.format) {
    return values.properties.data.format.toUpperCase().includes('INLINE');
  }

  return false;
};

const DataFeedForm = ({ title, datafeed, handleSubmit, submitting, values, match, loading, editMode, secrets, onShowEntitlements }) => (
  <div>
    <ActionsToolbar
      title={title}
      showActions={editMode}
      actions={[
        <Button
          key="datafeed--entitlements"
          flat
          iconChildren="security"
          onClick={onShowEntitlements}
        >
          Entitlements
        </Button>
      ]}
    />
    <Form onSubmit={handleSubmit} disabled={loading}>
      {loading && <ActivityContainer id="datafeed-form" />}
      <Row gutter={5}>
        {editMode &&
          <Col flex={12}>
            <Panel title="Resource Details" defaultExpanded={false}>
              <DetailsPane model={datafeed} />
            </Panel>
          </Col>}
        <Col flex={12}>
          <Panel title="General" expandable={false}>
            <Row gutter={5}>
              <Col flex={6} xs={12}>
                <Field
                  name="name"
                  label="Name"
                  component={TextField}
                  required
                />
              </Col>
            </Row>

            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  name="description"
                  label="Description"
                  component={TextField}
                  rows={1}
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={12}>
          <Panel title="Data" expandable={false}>
            <Row gutter={5}>
              <Col flex={3} xs={12}>
                <Field
                  id="datafeed-type"
                  name="properties.kind"
                  label="Type"
                  component={SelectField}
                  itemLabel="displayName"
                  itemValue="type"
                  menuItems={feedTypes}
                  required
                />
              </Col>

              <Col flex={3} xs={12}>
                <Field
                  id="datafeed-format"
                  name="properties.data.format"
                  label="Format"
                  component={SelectField}
                  menuItems={getFormats(values)}
                />
              </Col>

              <Col flex={6} xs={12}>
                <Field
                  name="properties.data.endpoint"
                  label="URI"
                  component={TextField}
                />
              </Col>

              <Col flex={6} xs={12}>
                <Field
                  name="properties.data.topic"
                  label="Topic"
                  component={TextField}
                  required
                />
              </Col>
              <Col flex={6} xs={12}>
                <Field
                  name="properties.data.group"
                  label="Group"
                  component={TextField}
                />
              </Col>
            </Row>

            <Row gutter={5}>
              {showEditor(values) &&
                <Col flex={12}>
                  <Field
                    component={AceEditor}
                    mode={getMode(values)}
                    name="properties.data.data"
                    maxLines={75}
                    minLines={5}
                  />
                </Col>}
            </Row>
          </Panel>
        </Col>

        <Col flex={12}>
          <Panel title="Classification" expandable={false}>
            <Row gutter={5}>
              {['Client Data', 'PII', 'HIPPA'].map(item => (
                <Col flex={2} xs={12} sm={6} md={4} key={item}>
                  <Field
                    key={item}
                    id={item}
                    label={item}
                    component={Checkbox}
                    name="properties.data.classification"
                    style={{ margin: 0 }}
                  />
                </Col>))}
            </Row>
          </Panel>
        </Col>

        <Col flex={12}>
          <Panel title="Secret" defaultExpanded={!!values.properties.data.secret}>
            <Row gutter={5}>
              <Col flex={6} xs={12}>
                <Field
                  name="properties.data.secret"
                  label="Secret"
                  itemLabel="name"
                  itemValue="id"
                  component={SelectField}
                  menuItems={secrets}
                  async
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <FullPageFooter>
          <Button
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds`}
            flat
            iconChildren="arrow_back"
            component={Link}
          >
            Data Feeds
          </Button>

          <Button
            type="submit"
            primary
            raised
            disabled={submitting}
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </FullPageFooter>
      </Row>
    </Form>
  </div>
);

DataFeedForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
  secrets: PropTypes.array.isRequired,
  onShowEntitlements: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  datafeed: PropTypes.object,
};

DataFeedForm.defaultProps = {
  editMode: false,
  datafeed: {},
};

export default withRouter(DataFeedForm);

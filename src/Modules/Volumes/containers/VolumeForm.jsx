import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Col, Row } from 'react-flexybox';
import { Link, withRouter } from 'react-router-dom';
import { withPickerData } from 'Modules/MetaResource';
import { Field } from 'react-final-form';
import { TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import { Panel } from 'components/Panels';
import Form from 'components/Form';
import { formatName } from 'util/forms';
import SelectedProvider from './SelectedProvider';
import VolumeConfigSection from '../components/VolumeConfigSection';

const resetFields = [{ field: 'properties.type', value: '' }, { field: 'properties.config', value: {} }];

const VolumeForm = ({ form, values, match, loading, submitting, handleSubmit, selectedProvider, providersData, editMode }) => (
  <Form onSubmit={handleSubmit} autoComplete="off" disabled={loading}>
    <Row gutter={5}>
      {!editMode &&
        <Col flex={7} xs={12} sm={12} md={12}>
          <Panel title="General" expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <SelectedProvider
                  label="CaaS Provider"
                  form={form}
                  resetFields={resetFields}
                  providers={providersData}
                />
              </Col>
              <Col flex={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Volume Name"
                  type="text"
                  required
                  parse={formatName}
                  helpText="alphanumeric and dashes are allowed "
                />
              </Col>
            </Row>
          </Panel>
        </Col>}

      <Col flex>
        <Panel title="Description" expandable={false} fill>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                id="description"
                component={TextField}
                name="description"
                placeholder="Description"
                rows={1}
                maxRows={6}
              />
            </Col>
          </Row>
        </Panel>
      </Col>
    </Row>

    {(selectedProvider.isSelected || editMode) &&
      <Row gutter={5}>
        <Col flex={12}>
          <VolumeConfigSection
            formValues={values}
            form={form}
            selectedProvider={selectedProvider}
            editMode={editMode}
          />
        </Col>
      </Row>}

    <FullPageFooter>
      <Button
        flat
        iconChildren="arrow_back"
        disabled={loading || submitting}
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/volumes`}
      >
        Volumes
      </Button>
      <Button
        raised
        iconChildren="save"
        type="submit"
        disabled={loading || submitting}
        primary
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    </FullPageFooter>
  </Form>
);

VolumeForm.propTypes = {
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  selectedProvider: PropTypes.object.isRequired,
  providersData: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
};

VolumeForm.defaultProps = {
  editMode: false,
};

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withRouter
)(VolumeForm);

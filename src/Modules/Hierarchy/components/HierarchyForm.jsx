import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Field } from 'react-final-form';
import { translate } from 'react-i18next';
import { Col, Row } from 'react-flexybox';
import { DialogContainer } from 'react-md';
import Form from 'components/Form';
import { ActivityContainer } from 'components/ProgressIndicators';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { UnixVariablesFormNew } from 'Modules/Variables';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';

class HierarchyForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    title: PropTypes.string,
    isEnvironment: PropTypes.bool,
    t: PropTypes.func.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    isEnvironment: false,
    loading: false,
    editMode: false,
  };

  transformName(name) {
    return name
      .trim()
      .replace(/[^\w\s]/gi, '')
      .replace(/ /g, '-')
      .toLowerCase();
  }

  handleName = (name) => {
    const { form, editMode } = this.props;

    form.change('description', name);

    if (!editMode) {
      form.change('name', this.transformName(name));
    }
  }

  handleShortName = (shortName) => {
    const { form } = this.props;

    form.change('name', shortName);
  }

  render() {
    const { title, values, history, editMode, loading, handleSubmit, pristine, submitting, invalid, isEnvironment, t } = this.props;
    const submitDisabled = pristine || loading || invalid || submitting;

    const modalActions = [
      <Button
        key="hierarchy-context-form--cancel"
        flat
        disabled={submitting}
        onClick={history.goBack}
      >
        Cancel
      </Button>,
      <Button
        key="hierarchy-context-form--create"
        raised
        disabled={submitDisabled}
        primary
        onClick={() => document.getElementById('hierarchy-context-form').dispatchEvent(new Event('submit'))}
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    ];

    return (
      <DialogContainer
        id="context-form-dialog"
        title={!loading && title}
        visible
        width="75em"
        actions={modalActions}
        onHide={() => { }}
      >
        {loading && <ActivityContainer primary centered id="context-form--loading" />}
        <Form id="hierarchy-context-form" onSubmit={handleSubmit} autoComplete="off" disabled={loading}>
          <Row gutter={5}>
            <Col flex={6} xs={12}>
              <Field
                component={TextField}
                name="description"
                label={t('containment.fields.description.label')}
                type="text"
                required
                onChange={this.handleName}
                helpText="the display name in gestalt platform"
              />
            </Col>
            <Col flex={6} xs={12}>
              <Field
                component={TextField}
                name="name"
                label={t('containment.fields.name.label')}
                type="text"
                required
                onChange={this.handleShortName}
                helpText="the name as it will appear in the target CaaS platform"
              />
            </Col>
            {isEnvironment &&
              <Col flex={6} xs={12}>
                <Field
                  id="environment-type"
                  component={SelectField}
                  name="properties.environment_type"
                  menuItems={['development', 'test', 'production']}
                  required
                  label={t('containment.fields.environmentType.label')}
                  simplifiedMenu={false}
                  helpText="a simple tag to indicate what this environment will be used for"
                />
              </Col>}
          </Row>

          <Row>
            <Col flex={12}>
              <Panel title="Environment Variables" noPadding noShadow expandable={false}>
                <UnixVariablesFormNew
                  fieldName="properties.env"
                  formValues={values}
                />
              </Panel>
            </Col>
          </Row>
        </Form>
      </DialogContainer>
    );
  }
}

export default compose(
  withRouter,
  translate(),
)(HierarchyForm);

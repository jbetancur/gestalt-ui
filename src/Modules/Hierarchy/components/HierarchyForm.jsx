import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Field } from 'react-final-form';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'react-flexybox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SelectField, TextField } from 'components/Form';
import { UnixVariablesForm } from 'Modules/Variables';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';

class HierarchyForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
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
    editMode: false,
  };

  transformName(name) {
    return name
      .trim()
      .replace(/[^\w\s]/gi, '')
      .replace(/ /g, '-')
      .toLowerCase();
  }

  handleName = (e) => {
    const { form, editMode } = this.props;

    form.change('description', e.target.value);

    if (!editMode) {
      form.change('name', this.transformName(e.target.value));
    }
  }

  handleShortName = (shortName) => {
    const { form } = this.props;

    form.change('name', shortName);
  }

  render() {
    const { title, history, editMode, handleSubmit, submitting, invalid, isEnvironment, t } = this.props;
    const submitDisabled = invalid || submitting;

    return (
      <Dialog
        id="context-modal"
        aria-labelledby="context-modal-title"
        aria-describedby="context-modal-description"
        open
        onClose={history.goBack}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="context-modal-title">{title}</DialogTitle>
        <form id="hierarchy-context-form" onSubmit={handleSubmit} autoComplete="off" style={{ overflow: 'scroll' }}>
          <DialogContent>
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
                  autoFocus={!editMode}
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
                    helpText="a simple tag to indicate what this environment will be used for"
                  />
                </Col>}
            </Row>
            <Row>
              <Col flex={12}>
                <Panel title="Environment Variables" noPadding noShadow expandable={false}>
                  <UnixVariablesForm
                    fieldName="properties.env"
                  />
                </Panel>
              </Col>
            </Row>
          </DialogContent>
        </form>

        <DialogActions>
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
            onClick={() => document.getElementById('hierarchy-context-form').dispatchEvent(new Event('submit', { cancelable: true }))}
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose(
  withRouter,
  withTranslation(),
)(HierarchyForm);

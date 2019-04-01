import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';
import { Col, Row } from 'react-flexybox';
import Form, { SelectField, TextField, AceEditor } from 'components/Form';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import { FileButton } from 'components/Buttons';
import { composeValidators, required } from 'util/forms';
import withAppDeployments from '../hocs/withAppDeployments';

const focusOnErrors = createDecorator();
const initialFormValues = {
  providerId: '',
  namespace: '',
  releaseName: '',
  data: '',
};
const listingPath = match => `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/appdeployments`;

class AppDeploymentCreate extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    appDeploymentsActions: PropTypes.object.isRequired,
    appDeploymentPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { appDeploymentsActions } = this.props;

    appDeploymentsActions.initAppDeploymentCreate();
  }

  create = (values) => {
    const { history, match, appDeploymentsActions } = this.props;

    const onSuccess = () => history.replace(listingPath(match));

    appDeploymentsActions.createAppDeployment({
      providerId: values.providerId,
      namespace: values.namespace,
      releaseName: values.releaseName,
      payload: values.data,
      onSuccess,
    });
  }

  render() {
    const { match, providers, appDeploymentPending } = this.props;

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <FinalForm
            onSubmit={this.create}
            decorators={[focusOnErrors]}
            initialValues={initialFormValues}
            render={({ handleSubmit, submitting, form }) => {
              const onFile = (file) => {
                const reader = new FileReader();

                reader.onload = () => {
                  form.change('data', reader.result);
                };

                reader.readAsText(file);
              };

              return (
                <Form
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  disabled={appDeploymentPending}
                  submitTitle="Create"
                  disabledSubmit={appDeploymentPending || submitting}
                  disabledCancel={appDeploymentPending || submitting}
                  showCancel
                  cancelTo={listingPath(match)}
                >
                  <Panel title="Application Deployment" expandable={false} noPadding>
                    <Row gutter={16}>
                      <Col flex={12}>
                        <Caption>
                          Use a multipart Kubernetes YAML configuration or the output of a compiled helm chart to create an application depoyment
                        </Caption>
                      </Col>

                      <Col flex={12}>
                        <Row gutter={5}>
                          <Col flex={6} xs={12}>
                            <Field
                              id="app-appdeployment-provider"
                              component={SelectField}
                              name="providerId"
                              menuItems={providers}
                              itemLabel="name"
                              itemValue="id"
                              label="Kubernetes Provider"
                              validate={composeValidators(required('a kubernetes provider is required'))}
                              async
                            />
                          </Col>
                        </Row>

                        <Row gutter={5}>
                          <Col flex={6} xs={12}>
                            <Field
                              component={TextField}
                              name="namespace"
                              label="Namespace"
                              validate={composeValidators(required('a namespace is required'))}
                            />
                          </Col>
                        </Row>

                        <Row gutter={5}>
                          <Col flex={6} xs={12}>
                            <Field
                              component={TextField}
                              name="releaseName"
                              label="Release Name"
                              validate={composeValidators(required('a release name is required'))}
                            />
                          </Col>
                        </Row>

                        <FileButton
                          id="app-deployment-yaml-config"
                          label="Upload YAML"
                          onChange={onFile}
                        />
                      </Col>
                    </Row>

                    <Field
                      component={AceEditor}
                      mode="yaml"
                      theme="dracula"
                      // tempData allows us to not display the config (temp security workaround) but allows us to deal with it as a PATH op in provider model
                      name="data"
                      maxLines={25}
                      minLines={25}
                      fontSize={12}
                      validate={composeValidators(required('a yaml multipart kubernetes configuration is required'))}
                    />
                  </Panel>
                </Form>
              );
            }}
          />
        </Col>
      </Row>
    );
  }
}

export default withAppDeployments({ unload: false })(AppDeploymentCreate);

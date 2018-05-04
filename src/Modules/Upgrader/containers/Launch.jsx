import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { Card, CardContent } from 'components/Cards';
import { Row, Col } from 'react-flexybox';
import { withPickerData } from 'Modules/MetaResource';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import { TextField, SelectField } from 'components/ReduxFormFields';
import { H1 } from 'components/Typography';
import Label from 'components/Label';
import Form from 'components/Form';
// import { getLastFromSplit } from 'util/helpers/strings';

class Launch extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    databaseProvidersData: PropTypes.array.isRequired,
    securityProvidersData: PropTypes.array.isRequired,
    caasProvidersData: PropTypes.array.isRequired,
    kongProvidersData: PropTypes.array.isRequired,
    gatewayProvidersData: PropTypes.array.isRequired,
    upgrade: PropTypes.object.isRequired,
    launchUpgrade: PropTypes.func.isRequired,
  };

  launch = (values) => {
    this.props.launchUpgrade(values);
  }

  render() {
    return (
      <FinalForm
        onSubmit={this.launch}
        // validate={validate}
        render={({ handleSubmit, pristine }) => (
          <Row center gutter={10}>
            <Col flex={6} xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Form onSubmit={handleSubmit}>
                    <Row gutter={5}>
                      <H1>Launch Upgrader</H1>

                      <Col flex={12}>
                        <Label>Status: </Label>
                        <span>{this.props.upgrade.active ? 'Initializing' : 'Uninitialized'}</span>
                      </Col>

                      <Col flex={12}>
                        <Field
                          name="image"
                          label="Upgrader Image"
                          component={TextField}
                        />
                      </Col>

                      <Col flex={12}>
                        <Field
                          id="dbProviderId"
                          name="dbProviderId"
                          label="Database Provider"
                          itemLabel="name"
                          itemValue="id"
                          menuItems={this.props.databaseProvidersData}
                          component={SelectField}
                          async
                        />
                      </Col>

                      <Col flex={12}>
                        <Field
                          id="secProviderId"
                          name="secProviderId"
                          label="Security Provider"
                          itemLabel="name"
                          itemValue="id"
                          menuItems={this.props.securityProvidersData}
                          component={SelectField}
                          async
                        />
                      </Col>

                      <Col flex={12}>
                        <Field
                          id="caasProviderId"
                          name="caasProviderId"
                          label="CaaS Provider"
                          itemLabel="name"
                          itemValue="id"
                          menuItems={this.props.caasProvidersData}
                          component={SelectField}
                          async
                        />
                      </Col>

                      <Col flex={12}>
                        <Field
                          id="kongProviderId"
                          name="kongProviderId"
                          label="Kong Provider"
                          itemLabel="name"
                          itemValue="id"
                          menuItems={this.props.kongProvidersData}
                          component={SelectField}
                          async
                        />
                      </Col>
                      <Col flex={12}>
                        <Field
                          id="gwmProviderId"
                          name="gwmProviderId"
                          label="Gateway Provider"
                          itemLabel="name"
                          itemValue="id"
                          menuItems={this.props.gatewayProvidersData}
                          component={SelectField}
                          async
                        />
                      </Col>
                    </Row>

                    <FullPageFooter
                      fullWidth
                      leftActions={
                        <Button flat iconChildren="arrow_back" onClick={() => this.props.history.goBack()}>
                          Back to Gestalt
                        </Button>
                      }
                      rightActions={
                        <Button raised primary type="submit" disabled={pristine}>
                          Launch Upgrader
                        </Button>
                      }
                    />
                  </Form>
                </CardContent>
              </Card>
            </Col>
          </Row>
        )}
      />
    );
  }
}

export default compose(
  withPickerData({ entity: 'root/providers', alias: 'databaseProviders', label: 'Providers', params: { type: 'Data' } }),
  withPickerData({ entity: 'root/providers', alias: 'securityProviders', label: 'Providers', params: { type: 'Security' } }),
  withPickerData({ entity: 'root/providers', alias: 'caasProviders', label: 'Providers', params: { type: 'CaaS' } }),
  withPickerData({ entity: 'root/providers', alias: 'kongProviders', label: 'Providers', params: { type: 'Kong' } }),
  withPickerData({ entity: 'root/providers', alias: 'gatewayProviders', label: 'Providers', params: { type: 'GatewayManager' } }),
)(Launch);

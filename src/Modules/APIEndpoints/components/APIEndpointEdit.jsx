import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { withPickerData } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { A } from 'components/Links';
import { FlatButton } from 'components/Buttons';
import { EntitlementIcon } from 'components/Icons';
import { Tabs, Tab } from 'components/Tabs';
import { Card } from 'components/Cards';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import PayloadViewer from './PayloadViewer';
import APIEndpointForm from './APIEndpointForm';
import validate from './validations';
import { generatePatches } from '../payloadTransformer';
import { getEditEndpointModel, selectAPIEndpoint } from '../selectors';
import withAPIEndpoint from '../hocs/withAPIEndpoint';

class APIEndpointEdit extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    apiEndpoint: PropTypes.object.isRequired,
    apiEndpointActions: PropTypes.object.isRequired,
    fetchcontainersData: PropTypes.func.isRequired,
    fetchlambdasData: PropTypes.func.isRequired,
    apiEndpointPending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  };

  static contextType = ModalContext;

  componentDidMount() {
    const { match, apiEndpointActions } = this.props;

    apiEndpointActions.fetchAPIEndpoint({ fqon: match.params.fqon, id: match.params.apiEndpointId });
  }

  componentWillReceiveProps(nextProps) {
    const { fetchcontainersData, fetchlambdasData } = nextProps;

    // update the ui to the correct api type
    if (nextProps.apiEndpoint.id !== this.props.apiEndpoint.id) {
      if (nextProps.apiEndpoint.properties.implementation_type === 'container') {
        fetchcontainersData();
      } else {
        fetchlambdasData();
      }
    }
  }

  update = (values) => {
    const { match, history, apiEndpoint, apiEndpointActions } = this.props;
    const payload = generatePatches(apiEndpoint, values);

    if (payload.length) {
      const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`);

      apiEndpointActions.updateAPIEndpoint({ fqon: match.params.fqon, id: apiEndpoint.id, payload, onSuccess });
    }
  }

  showEntitlements = () => {
    const { apiEndpoint } = this.props;
    const { showModal } = this.context;

    showModal(EntitlementModal, {
      title: `Entitlements for "${apiEndpoint.properties.resource}" APIEndpoint`,
      fqon: apiEndpoint.org.properties.fqon,
      entityId: apiEndpoint.id,
      entityKey: 'apiendpoints',
    });
  }

  render() {
    const { match, initialFormValues, apiEndpoint, apiEndpointPending } = this.props;

    if (apiEndpointPending && !apiEndpoint.id) {
      return <ActivityContainer id="apiEndpoint-loading" />;
    }

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={apiEndpoint.properties.resource}
            subtitle={apiEndpoint.properties.public_url ? <A href={apiEndpoint.properties.public_url} target="_blank" rel="noopener noreferrer" primary>{apiEndpoint.properties.public_url}</A> : null}
            sticky
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`}
            showActions={!!apiEndpoint.id}
            actions={[
              <FlatButton
                key="endpoint--entitlements"
                icon={<EntitlementIcon size={20} />}
                label="Entitlements"
                onClick={this.showEntitlements}
              />]
            }
          />

          {apiEndpointPending && <ActivityContainer id="apiEndpoint-form" />}

          <Tabs>
            <Tab title="Endpoint">
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Resource Details" defaultExpanded={false}>
                    <DetailsPane model={apiEndpoint} />
                  </Panel>
                </Col>
              </Row>

              <Form
                editMode
                onSubmit={this.update}
                initialValues={initialFormValues}
                render={APIEndpointForm}
                validate={validate}
                loading={apiEndpointPending}
                {...this.props}
              />
            </Tab>

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      value={apiEndpoint}
                      name={apiEndpoint.name}
                    />
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  apiEndpoint: selectAPIEndpoint(state),
  initialFormValues: getEditEndpointModel(state),
});

export default compose(
  withPickerData({ entity: 'lambdas', label: 'Lambdas', fetchOnMount: false, params: { expand: true } }),
  withPickerData({ entity: 'containers', label: 'Containers', fetchOnMount: false, params: { expand: true } }),
  withAPIEndpoint(),
  connect(mapStateToProps),
)(APIEndpointEdit);

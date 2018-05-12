import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { A } from 'components/Links';
import { Button } from 'components/Buttons';
import APIEndpointForm from './APIEndpointForm';
import validate from './validations';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditEndpointModel, selectAPIEndpoint } from '../selectors';

class APIEndpointEdit extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    apiEndpoint: PropTypes.object.isRequired,
    fetchAPIEndpoint: PropTypes.func.isRequired,
    updateAPIEndpoint: PropTypes.func.isRequired,
    fetchcontainersData: PropTypes.func.isRequired,
    fetchlambdasData: PropTypes.func.isRequired,
    apiEndpointPending: PropTypes.bool.isRequired,
    unloadAPIEndpoint: PropTypes.func.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, fetchAPIEndpoint } = this.props;

    fetchAPIEndpoint(match.params.fqon, match.params.apiEndpointId);
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

  componentWillUnmount() {
    const { unloadAPIEndpoint } = this.props;

    unloadAPIEndpoint();
  }

  update = (values) => {
    const { match, history, apiEndpoint, updateAPIEndpoint } = this.props;
    const patches = generatePatches(apiEndpoint, values);

    if (patches.length) {
      const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis/${match.params.apiId}`);
      updateAPIEndpoint(match.params.fqon, apiEndpoint.id, patches, onSuccess);
    }
  }

  showEntitlements = () => {
    const { match, entitlementActions, apiEndpoint } = this.props;
    entitlementActions.showEntitlementsModal(apiEndpoint.name, match.params.fqon, apiEndpoint.id, 'apiendpoints', 'API Endpoint');
  }

  render() {
    const { initialFormValues, apiEndpoint, apiEndpointPending } = this.props;

    return (
      apiEndpointPending ?
        <ActivityContainer id="apiEndpoint-loading" /> :
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12} md={12}>
            <ActionsToolbar
              title={apiEndpoint.properties.resource}
              subtitle={apiEndpoint.properties.public_url ? <A href={apiEndpoint.properties.public_url} target="_blank" rel="noopener noreferrer" primary>{apiEndpoint.properties.public_url}</A> : null}
              showActions={apiEndpoint.id}
              actions={[
                <Button
                  key="apiEndpoint--entitlements"
                  flat
                  iconChildren="security"
                  onClick={this.showEntitlements}
                >
                  Entitlements
                </Button>]
              }
            />

            {apiEndpointPending && <ActivityContainer id="apiEndpoint-form" />}

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
  withPickerData({ entity: 'lambdas', label: 'Lambdas', fetchOnMount: false }),
  withPickerData({ entity: 'containers', label: 'Containers', fetchOnMount: false }),
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, actions),
)(APIEndpointEdit);

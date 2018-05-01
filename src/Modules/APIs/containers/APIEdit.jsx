import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { withAPI, withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { APIEndpoints } from 'Modules/APIEndpoints';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import DetailsPane from 'components/DetailsPane';
import { Tabs, Tab } from 'components/Tabs';
import { FullPageFooter } from 'components/FullPage';
import APIForm from './APIForm';
import validate from './validations';
import actions from '../actions';
import { generateAPIPatches } from '../payloadTransformer';
import { getEditAPIModel } from '../selectors';

class APIEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apiActions: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    apiPending: PropTypes.bool.isRequired,
    fetchProviderKongsByGateway: PropTypes.func.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, apiActions, fetchProviderKongsByGateway } = this.props;

    fetchProviderKongsByGateway(match.params.fqon, match.params.environmentId, 'environments');
    apiActions.fetchAPI({ fqon: match.params.fqon, id: match.params.apiId });
  }

  update = (values) => {
    const { match, api, apiActions } = this.props;
    const payload = generateAPIPatches(api, values);

    apiActions.updateAPI({ fqon: match.params.fqon, id: match.params.apiId, payload });
  }

  showEntitlements = () => {
    const { match, api, entitlementActions } = this.props;

    entitlementActions.showEntitlementsModal(api.name, match.params.fqon, api.id, 'apis', 'API');
  }

  render() {
    const { match, api, apiPending, initialFormValues } = this.props;

    return (
      apiPending && !api.id ?
        <ActivityContainer id="api-loading" /> :
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12} md={12}>
            <ActionsToolbar
              title={api.name}
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
                  onClick={this.showEntitlements}
                >
                    Entitlements
                </Button>]}
            />

            {apiPending && <ActivityContainer id="api-loading" />}

            <Tabs>
              <Tab title="Endpoints">
                <Row gutter={5}>
                  <Col flex={12}>
                    <APIEndpoints {...this.props} />
                  </Col>
                </Row>

                <FullPageFooter>
                  <Button
                    flat
                    iconChildren="arrow_back"
                    component={Link}
                    to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis`}
                  >
                    APIs
                  </Button>
                </FullPageFooter>
              </Tab>

              <Tab title="API">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Panel title="Resource Details" defaultExpanded={false}>
                      <DetailsPane model={api} />
                    </Panel>
                  </Col>
                </Row>

                <Form
                  editMode
                  onSubmit={this.update}
                  initialValues={initialFormValues}
                  render={APIForm}
                  validate={validate}
                  loading={apiPending}
                  {...this.props}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
    );
  }
}

function mapStateToProps(state) {
  const { api } = state.metaResource.api;

  return {
    api,
    initialFormValues: getEditAPIModel(state),
  };
}

export default compose(
  withAPI,
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, actions),
)(APIEdit);

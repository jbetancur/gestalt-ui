import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withPickerData } from 'Modules/MetaResource';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { FlatButton } from 'components/Buttons';
import { EntitlementIcon } from 'components/Icons';
import { Panel } from 'components/Panels';
import { Tabs, Tab } from 'components/Tabs';
import { Card } from 'components/Cards';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import PayloadViewer from './PayloadViewer';
import DataFeedForm from './DataFeedForm';
import validate from './validations';
import { getDatafeed } from '../selectors';
import { generatePatches } from '../payloadTransformer';
// import { DATA_CLASSIFICATION } from '../../../constants';
import withDatafeed from '../hocs/withDatafeed';
import withResourceType from '../../ResourceTypes/hocs/withResourceType';

class DataFeedEdit extends Component {
  static propTypes = {
    datafeedActions: PropTypes.object.isRequired,
    datafeed: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    datafeedPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    secretsData: PropTypes.array.isRequired,
    // resourceTypeActions: PropTypes.object.isRequired,
    resourceType: PropTypes.object.isRequired,
  };

  static contextType = ModalConsumer;

  componentDidMount() {
    const { datafeedActions, match } = this.props;

    datafeedActions.fetchDatafeed({ fqon: match.params.fqon, id: match.params.datafeedId });
    // resourceTypeActions.fetchResourceType({ fqon: 'root', id: DATA_CLASSIFICATION });
  }

  showEntitlements = () => {
    const { datafeed } = this.props;
    const { showModal } = this.context;

    showModal(EntitlementModal, {
      title: `Entitlements for "${datafeed.name}" Data Feed`,
      fqon: datafeed.org.properties.fqon,
      entityId: datafeed.id,
      entityKey: 'datafeeds',
    });
  }

  onSubmit = (values) => {
    const { match, history, datafeedActions, initialFormValues } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds/${response.id}`);
    const payload = generatePatches(initialFormValues, values);

    datafeedActions.updateDatafeed({ fqon: match.params.fqon, id: match.params.datafeedId, payload, onSuccess });
  };

  render() {
    const { match, datafeedPending, datafeed, secretsData, resourceType, initialFormValues } = this.props;

    if (datafeedPending && !datafeed.id) {
      return <ActivityContainer id="datafeed-loading" />;
    }

    return (
      <Row center>
        <Col flex={8} xs={12} sm={12} md={10}>
          <ActionsToolbar
            title={datafeed.name}
            sticky
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds`}
            actions={[
              <FlatButton
                key="datafeed--entitlements"
                icon={<EntitlementIcon size={20} />}
                label="Entitlements"
                onClick={this.showEntitlements}
              />,
            ]}
          />

          {datafeedPending && <ActivityContainer id="datafeed-form" />}

          <Tabs>
            <Tab title="Data Feed">
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Resource Details" defaultExpanded={false}>
                    <DetailsPane model={datafeed} />
                  </Panel>
                </Col>
              </Row>

              <FinalForm
                editMode
                onSubmit={this.onSubmit}
                initialValues={initialFormValues}
                validate={validate}
                secrets={secretsData}
                tags={resourceType.tags}
                render={({ handleSubmit, submitting, pristine, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    submitTitle="Update"
                    disabled={datafeedPending}
                    disabledSubmit={datafeedPending || submitting}
                  >
                    <DataFeedForm {...rest} />
                  </Form>
                )}
              />
            </Tab>

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      value={datafeed}
                      name={datafeed.name}
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

const mapStatetoProps = state => ({
  initialFormValues: getDatafeed(state),
});

export default compose(
  withPickerData({ entity: 'secrets', label: 'Secrets' }),
  withDatafeed,
  withResourceType,
  withRouter,
  connect(mapStatetoProps)
)(DataFeedEdit);

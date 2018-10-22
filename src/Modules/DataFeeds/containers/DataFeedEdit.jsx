import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { Form } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import DataFeedForm from './DataFeedForm';
import validate from './validations';
import { getDatafeed } from '../selectors';
import { generatePatches } from '../payloadTransformer';
import { DATA_CLASSIFICATION } from '../../../constants';
import withDatafeed from '../hocs/withDatafeed';
import withResourceType from '../../ResourceTypes/hocs/withResourceType';

class DataFeedEdit extends Component {
  static propTypes = {
    datafeedActions: PropTypes.object.isRequired,
    datafeed: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    datafeedPending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    secretsData: PropTypes.array.isRequired,
    resourceTypeActions: PropTypes.object.isRequired,
    resourceType: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { datafeedActions, resourceTypeActions, match } = this.props;

    datafeedActions.fetchDatafeed({ fqon: match.params.fqon, id: match.params.datafeedId });
    resourceTypeActions.fetchResourceType({ fqon: 'root', id: DATA_CLASSIFICATION });
  }

  onShowEntitlements = () => {
    const { entitlementActions, datafeed, match } = this.props;

    entitlementActions.showEntitlementsModal(datafeed.name, match.params.fqon, datafeed.id, 'datafeeds', 'Data Feed');
  }

  onSubmit = (values) => {
    const { match, history, datafeedActions, initialFormValues } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds/${response.id}`);
    const payload = generatePatches(initialFormValues, values);

    datafeedActions.updateDatafeed({ fqon: match.params.fqon, id: match.params.datafeedId, payload, onSuccess });
  };

  render() {
    const { datafeedPending, datafeed, secretsData, resourceType, initialFormValues } = this.props;

    return (
      datafeedPending && !datafeed.id ?
        <ActivityContainer id="datafeed-loading" /> :
        <Row center>
          <Col flex={8} xs={12} sm={12} md={10}>
            <ActionsToolbar
              title={datafeed.name}
              actions={[
                <Button
                  key="datafeed--entitlements"
                  flat
                  iconChildren="security"
                  onClick={this.onShowEntitlements}
                >
                  Entitlements
                </Button>,
              ]}
            />

            {datafeedPending && <ActivityContainer id="datafeed-form" />}

            <Row gutter={5}>
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={datafeed} />
                </Panel>
              </Col>
            </Row>

            <Form
              editMode
              onSubmit={this.onSubmit}
              initialValues={initialFormValues}
              render={DataFeedForm}
              validate={validate}
              loading={datafeedPending}
              secrets={secretsData}
              tags={resourceType.tags}
            />
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
  withEntitlements,
  withDatafeed,
  withResourceType,
  withRouter,
  connect(mapStatetoProps)
)(DataFeedEdit);

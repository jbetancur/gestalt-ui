import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withDatafeed, withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { Form } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import DataFeedForm from './DataFeedForm';
import validate from './validations';
import { getDatafeed } from '../selectors';
import { generatePatches } from '../payloadTransformer';

class DataFeedEdit extends Component {
  static propTypes = {
    datafeedActions: PropTypes.object.isRequired,
    datafeed: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    datafeedPending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    secretsData: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const { datafeedActions, match } = this.props;

    datafeedActions.fetchDatafeed({ fqon: match.params.fqon, id: match.params.datafeedId });
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
    const { datafeedPending, datafeed, secretsData, initialFormValues } = this.props;

    return (
      datafeedPending && !datafeed.id ?
        <ActivityContainer id="datafeed-loading" /> :
        <Row justifyContent="center">
          <Col flex={8} xs={12} sm={12} md={10}>
            <Form
              title={datafeed.name}
              editMode
              onSubmit={this.onSubmit}
              initialValues={initialFormValues}
              render={DataFeedForm}
              validate={validate}
              loading={datafeedPending}
              secrets={secretsData}
              onShowEntitlements={this.onShowEntitlements}
              datafeed={datafeed}
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
  withRouter,
  connect(mapStatetoProps)
)(DataFeedEdit);

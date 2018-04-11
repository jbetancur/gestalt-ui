import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { withDatafeed, withPickerData } from 'Modules/MetaResource';
import { Form } from 'react-final-form';
import { ActivityContainer } from 'components/ProgressIndicators';
import DataFeedForm from './DataFeedForm';
import validate from './validations';
import { getDatafeed } from '../selectors';
import { generatePatches } from '../payloadTransformer';

class DataFeedEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    datafeedActions: PropTypes.object.isRequired,
    datafeed: PropTypes.object.isRequired,
    datafeedPending: PropTypes.bool.isRequired,
    secretsData: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const { datafeedActions, match } = this.props;

    datafeedActions.fetchDatafeed({ fqon: match.params.fqon, id: match.params.datafeedId });
  }

  onSubmit = (values) => {
    const { match, history, datafeedActions, datafeed } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds/${response.id}`);
    const payload = generatePatches(datafeed, values);

    datafeedActions.updateDatafeed({ fqon: match.params.fqon, id: match.params.datafeedId, payload, onSuccess });
  };

  render() {
    const { datafeedPending, datafeed, secretsData } = this.props;

    return (
      datafeedPending && !datafeed.id ?
        <ActivityContainer id="datafeed-loading" /> :
        <Row justifyContent="center">
          <Col flex={8} xs={12} sm={12} md={10}>
            <Form
              onSubmit={this.onSubmit}
              initialValues={datafeed}
              render={DataFeedForm}
              validate={validate}
              loading={datafeedPending}
              editMode
              secrets={secretsData}
            />
          </Col>
        </Row>
    );
  }
}

const mapStatetoProps = state => ({
  datafeed: getDatafeed(state),
});

export default compose(
  withPickerData({ entity: 'secrets', label: 'Secrets' }),
  withDatafeed,
  withRouter,
  connect(mapStatetoProps)
)(DataFeedEdit);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { withDatafeed, withPickerData, withResourceType, metaModels } from 'Modules/MetaResource';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import { generateContextEntityState } from 'util/helpers/context';
import DataFeedForm from './DataFeedForm';
import validate from './validations';
import { DATA_CLASSIFICATION } from '../../../constants';

const initialValues = metaModels.datafeed.create({
  properties: {
    kind: 'kafka',
    data: {
      format: 'JSON',
    },
  },
});

class DataFeedCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    datafeedActions: PropTypes.object.isRequired,
    datafeedPending: PropTypes.bool.isRequired,
    secretsData: PropTypes.array.isRequired,
    resourceTypeActions: PropTypes.object.isRequired,
    resourceType: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { resourceTypeActions } = this.props;

    resourceTypeActions.fetchResourceType({ fqon: 'root', id: DATA_CLASSIFICATION });
  }

  onSubmit = (values) => {
    const { match, history, datafeedActions } = this.props;
    const onSuccess = response =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds/${response.id}`);
    const entity = generateContextEntityState(match.params);

    datafeedActions.createDatafeed({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, payload: values, onSuccess });
  };


  render() {
    const { datafeedPending, secretsData, resourceType } = this.props;
    return (
      <Row center>
        <Col flex={8} xs={12} sm={12} md={10}>
          <ActionsToolbar title="Create a Data Feed" />

          {datafeedPending && <ActivityContainer id="datafeed-form" />}

          <Form
            onSubmit={this.onSubmit}
            initialValues={initialValues}
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

export default compose(
  withPickerData({ entity: 'secrets', label: 'Secrets' }),
  withDatafeed,
  withResourceType,
  withRouter,
)(DataFeedCreate);

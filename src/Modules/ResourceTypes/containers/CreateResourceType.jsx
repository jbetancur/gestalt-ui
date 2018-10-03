import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexybox';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withPickerData } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import ResourceTypeForm from './ResourceTypeForm';
import validate from '../validations';
import { generatePayload } from '../payloadTransformer';
import { getCreateResourceTypeModel } from '../selectors';
import actions from '../actions';
import withResourceType from '../hocs/withResourceType';

class CreateResourceType extends PureComponent {
  static propTypes = {
    resourceTypeActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resourceTypePending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { history, match, resourceTypeActions } = this.props;
    const payload = generatePayload(values);
    const onSuccess = () => history.replace(`/${match.params.fqon}/resourcetypes`);

    resourceTypeActions.createResourceType({ fqon: match.params.fqon, payload, onSuccess });
  }

  render() {
    const { resourceTypePending } = this.props;

    return (
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>

          <ActionsToolbar title="Create a Resource Type" />

          {resourceTypePending && <ActivityContainer id="resourceType-form" />}

          <Form
            render={ResourceTypeForm}
            onSubmit={this.create}
            mutators={{ ...arrayMutators }}
            validate={validate}
            pending={resourceTypePending}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: getCreateResourceTypeModel(state),
});

export default compose(
  withResourceType,
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false }),
  connect(mapStateToProps, actions),
)(CreateResourceType);

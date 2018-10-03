import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Row, Col } from 'react-flexybox';
import { withPickerData, withMetaResource } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Panel } from 'components/Panels';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import ResourceTypeForm from './ResourceTypeForm';
import validate from '../validations';
import { generatePatches, batchTypeProps } from '../payloadTransformer';
import { getEditResourceTypeModel } from '../selectors';
import actions from '../actions';
import withResourceType from '../hocs/withResourceType';

class EditResourceType extends PureComponent {
  static propTypes = {
    resourceTypeActions: PropTypes.object.isRequired,
    batchUpdateTypeProperties: PropTypes.func.isRequired,
    resourceType: PropTypes.object.isRequired,
    resourceTypePending: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, resourceTypeActions } = this.props;

    resourceTypeActions.fetchResourceType({ fqon: match.params.fqon, id: match.params.resourceTypeId, params: { withprops: true } });
  }

  update = (values) => {
    const { match, resourceType, resourceTypeActions, batchUpdateTypeProperties } = this.props;
    const payload = generatePatches(resourceType, values);
    const batchOps = batchTypeProps(resourceType.id, resourceType.property_defs, values.property_defs);
    const onSuccessTypePropsUpdate = () => resourceTypeActions.updateResourceType({ fqon: match.params.fqon, id: match.params.resourceTypeId, payload, params: { withprops: true } });

    batchUpdateTypeProperties(match.params.fqon, batchOps, onSuccessTypePropsUpdate);
  }

  render() {
    const { resourceTypePending, resourceType } = this.props;

    return (
      resourceTypePending && !resourceType.id ?
        <ActivityContainer id="resourceType-loading" /> :
        <Row gutter={5} center>
          <Col flex={10} xs={12} sm={12} md={12}>

            <ActionsToolbar
              title={resourceType.name}
              subtitle={resourceType.extend && `extends: ${resourceType.extend}`}
            />

            <Row gutter={5}>
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={resourceType} />
                </Panel>
              </Col>
            </Row>

            {resourceTypePending && <ActivityContainer id="resourceType-form" />}

            <Form
              editMode
              render={ResourceTypeForm}
              onSubmit={this.update}
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
  initialValues: getEditResourceTypeModel(state),
});

export default compose(
  withResourceType,
  withMetaResource,
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false }),
  connect(mapStateToProps, actions),
)(EditResourceType);

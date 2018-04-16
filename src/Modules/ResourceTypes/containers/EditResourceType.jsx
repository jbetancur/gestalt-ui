import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withResourceType, withPickerData, withMetaResource } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import ResourceTypeForm from './ResourceTypeForm';
import validate from '../validations';
import { generatePatches, batchTypeProps } from '../payloadTransformer';
import { getEditResourceTypeModel } from '../selectors';

class EditResourceType extends PureComponent {
  static propTypes = {
    resourceTypeActions: PropTypes.func.isRequired,
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
      <div>
        {resourceTypePending && !resourceType.id ?
          <ActivityContainer id="resourceType-loading" /> :
          <ResourceTypeForm
            title={resourceType.name}
            onSubmit={this.update}
            editMode
            {...this.props}
          />}
      </div>
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
  connect(mapStateToProps),
  reduxForm({
    form: 'editResourceTypeForm',
    enableReinitialize: true,
    validate,
  }),
)(EditResourceType);

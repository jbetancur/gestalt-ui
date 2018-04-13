import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, withPickerData } from 'Modules//MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import ResourceTypeForm from './ResourceTypeForm';
import validate from '../validations';
import { generatePatches, batchTypeProps } from '../payloadTransformer';
import { getEditResourceTypeModel } from '../selectors';

class EditResourceType extends PureComponent {
  static propTypes = {
    fetchResourceType: PropTypes.func.isRequired,
    updateResourceType: PropTypes.func.isRequired,
    createResourceType: PropTypes.func.isRequired,
    batchUpdateTypeProperties: PropTypes.func.isRequired,
    resourceType: PropTypes.object.isRequired,
    unloadResourceType: PropTypes.func.isRequired,
    resourceTypePending: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, fetchResourceType } = this.props;

    fetchResourceType(match.params.fqon, match.params.resourceTypeId);
  }

  componentWillUnmount() {
    const { unloadResourceType } = this.props;

    unloadResourceType();
  }

  update = (values) => {
    const { match, resourceType, updateResourceType, batchUpdateTypeProperties } = this.props;
    const patches = generatePatches(resourceType, values);
    const batchOps = batchTypeProps(resourceType.id, resourceType.property_defs, values.property_defs);
    const onSuccessTypePropsUpdate = () => updateResourceType(match.params.fqon, resourceType.id, patches);

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
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false }),
  withMetaResource,
  connect(mapStateToProps),
  reduxForm({
    form: 'editResourceTypeForm',
    enableReinitialize: true,
    validate,
  }),
)(EditResourceType);

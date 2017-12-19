import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { withMetaResource } from 'Modules//MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import ResourceTypeForm from '../components/ResourceTypeForm';
import validate from '../validations';
import { generatePatches, batchTypeProps } from '../payloadTransformer';
import { getEditResourceTypeModel } from '../selectors';

class EditResourceType extends PureComponent {
  static propTypes = {
    fetchResourceTypes: PropTypes.func.isRequired,
    fetchResourceType: PropTypes.func.isRequired,
    updateResourceType: PropTypes.func.isRequired,
    createResourceType: PropTypes.func.isRequired,
    batchUpdateTypeProperties: PropTypes.func.isRequired,
    resourceTypes: PropTypes.array.isRequired,
    resourceType: PropTypes.object.isRequired,
    unloadResourceType: PropTypes.func.isRequired,
    resourceTypePending: PropTypes.bool.isRequired,
    formValues: PropTypes.object,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {
    formValues: {},
  };

  componentDidMount() {
    const { match, fetchResourceTypes, fetchResourceType } = this.props;

    fetchResourceTypes('root');
    fetchResourceType('root', match.params.resourceTypeId);
  }

  componentWillUnmount() {
    const { unloadResourceType } = this.props;

    unloadResourceType();
  }

  update = (values) => {
    const { resourceType, updateResourceType, batchUpdateTypeProperties } = this.props;
    const patches = generatePatches(resourceType, values);
    const batchOps = batchTypeProps(resourceType.id, resourceType.property_defs, values.property_defs);
    const onSuccessTypePropsUpdate = () => updateResourceType('root', resourceType.id, patches);

    batchUpdateTypeProperties('root', batchOps, onSuccessTypePropsUpdate);
  }

  render() {
    const { resourceTypePending, resourceType } = this.props;

    return (
      <div>
        {resourceTypePending ?
          <ActivityContainer id="resourceType-loading" /> :
          <ResourceTypeForm
            title={resourceType.name}
            onSubmit={this.update}
            editMode
            resourceType={resourceType}
            {...this.props}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formValues: getFormValues('editResourceTypeForm')(state),
  initialValues: getEditResourceTypeModel(state),
});

export default compose(
  withMetaResource,
  connect(mapStateToProps),
  reduxForm({
    form: 'editResourceTypeForm',
    enableReinitialize: true,
    validate,
  }),
)(EditResourceType);

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { withMetaResource } from 'Modules//MetaResource';
import ResourceTypeForm from '../components/ResourceTypeForm';
import validate from '../validations';
import { generateResourcePayload } from '../payloadTransformer';
import { getCreateResourceTypeModel } from '../selectors';

class CreateResourceType extends PureComponent {
  static propTypes = {
    fetchResourceTypes: PropTypes.func.isRequired,
    createResourceType: PropTypes.func.isRequired,
    resourceTypes: PropTypes.array.isRequired,
    formValues: PropTypes.object,
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {
    formValues: {},
  };

  componentDidMount() {
    this.props.fetchResourceTypes('root');
  }

  create = (values) => {
    const { history, createResourceType } = this.props;
    const payload = generateResourcePayload(values);
    const onSuccess = () => history.replace('/root/resourcetypes');

    createResourceType('root', payload, onSuccess);
  }

  render() {
    return (
      <ResourceTypeForm
        title="Create Resource Type"
        onSubmit={this.create}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  formValues: getFormValues('createResourceTypeForm')(state),
  initialValues: getCreateResourceTypeModel(state),
});

export default compose(
  withMetaResource,
  connect(mapStateToProps),
  reduxForm({
    form: 'createResourceTypeForm',
    validate,
  }),
)(CreateResourceType);

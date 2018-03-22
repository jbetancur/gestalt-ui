import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules//MetaResource';
import ResourceTypeForm from './ResourceTypeForm';
import validate from '../validations';
import { generatePayload } from '../payloadTransformer';
import { getCreateResourceTypeModel } from '../selectors';

class CreateResourceType extends PureComponent {
  static propTypes = {
    fetchResourceTypesDropDown: PropTypes.func.isRequired,
    createResourceType: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, fetchResourceTypesDropDown } = this.props;

    fetchResourceTypesDropDown(match.params.fqon);
  }

  create = (values) => {
    const { history, match, createResourceType } = this.props;
    const payload = generatePayload(values);
    const onSuccess = () => history.replace(`/${match.params.fqon}/resourcetypes`);

    createResourceType(match.params.fqon, payload, onSuccess);
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

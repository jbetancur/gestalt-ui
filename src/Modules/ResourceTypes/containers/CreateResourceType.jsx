import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withResourceType, withPickerData } from 'Modules/MetaResource';
import ResourceTypeForm from './ResourceTypeForm';
import validate from '../validations';
import { generatePayload } from '../payloadTransformer';
import { getCreateResourceTypeModel } from '../selectors';

class CreateResourceType extends PureComponent {
  static propTypes = {
    resourceTypeActions: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  create = (values) => {
    const { history, match, resourceTypeActions } = this.props;
    const payload = generatePayload(values);
    const onSuccess = () => history.replace(`/${match.params.fqon}/resourcetypes`);

    resourceTypeActions.createResourceType({ fqon: match.params.fqon, payload, onSuccess });
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
  withResourceType,
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false }),
  connect(mapStateToProps),
  reduxForm({
    form: 'createResourceTypeForm',
    validate,
  }),
)(CreateResourceType);

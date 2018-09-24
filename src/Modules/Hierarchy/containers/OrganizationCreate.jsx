import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateOrganizationPayload } from '../payloadTransformer';
import organizationModel from '../models/organization';
import withContext from '../hocs/withContext';

const initialFormValues = organizationModel.get();

class OrganizationCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    selectedOrganizationPending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, contextActions } = this.props;
    const payload = generateOrganizationPayload(values);
    const onSuccess = () => {
      history.replace(`/${match.params.fqon}/hierarchy`);
    };

    contextActions.createOrg({ fqon: match.params.fqon, payload, onSuccess });
  }

  render() {
    const { selectedOrganizationPending } = this.props;

    return (
      selectedOrganizationPending
        ?
          <ActivityContainer centered id="organization-create--loading" />
        :
          <Form
            component={HierarchyForm}
            title="Create an Organization"
            onSubmit={this.create}
            initialValues={initialFormValues}
            validate={validate()}
            mutators={{ ...arrayMutators }}
          />
    );
  }
}

export default compose(
  withContext(),
)(OrganizationCreate);

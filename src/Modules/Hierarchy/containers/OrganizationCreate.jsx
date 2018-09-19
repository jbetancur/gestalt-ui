import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withOrganization } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateOrganizationPayload } from '../payloadTransformer';
import organizationModel from '../models/organization';

const initialFormValues = organizationModel.get();

class OrganizationCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    organizationActions: PropTypes.object.isRequired,
    organizationPending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, organizationActions } = this.props;
    const payload = generateOrganizationPayload(values);
    const onSuccess = () => {
      organizationActions.fetchOrgSet({ fqon: match.params.fqon });
      history.replace(`/${match.params.fqon}/hierarchy`);
    };

    organizationActions.createOrg({ fqon: match.params.fqon, payload, onSuccess });
  }

  render() {
    const { organizationPending } = this.props;

    return (
      <Form
        component={HierarchyForm}
        title="Create an Organization"
        loading={organizationPending}
        onSubmit={this.create}
        initialValues={initialFormValues}
        validate={validate()}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

export default compose(
  withOrganization(),
)(OrganizationCreate);

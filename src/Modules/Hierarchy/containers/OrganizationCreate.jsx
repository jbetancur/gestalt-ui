import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateOrganizationPayload } from '../payloadTransformer';

const initialFormValues = metaModels.organization.get();

class OrganizationCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createOrg: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    organizationPending: PropTypes.bool.isRequired,
  };

  create = (values) => {
    const { match, history, createOrg, fetchOrgSet } = this.props;
    const payload = generateOrganizationPayload(values);
    const onSuccess = () => {
      fetchOrgSet(match.params.fqon);
      history.replace(`/${match.params.fqon}/hierarchy`);
    };

    createOrg(match.params.fqon, payload, onSuccess);
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
        validate={validate}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

export default compose(
  withMetaResource,
)(OrganizationCreate);

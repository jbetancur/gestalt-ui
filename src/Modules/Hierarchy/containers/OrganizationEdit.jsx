import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withMetaResource } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateOrganizationPatches } from '../payloadTransformer';
import { getEditOrganizationModel } from '../selectors';

class OrgEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    fetchOrg: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    updateOrg: PropTypes.func.isRequired,
    organizationPending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, fetchOrg } = this.props;

    fetchOrg(match.params.fqon);
  }

  update = (values) => {
    const { match, history, location, organization, updateOrg, fetchOrgSet } = this.props;
    const patches = generateOrganizationPatches(organization, values);
    const onSuccess = (response) => {
      const fqon = location.state.card ? response.org.properties.fqon : match.params.fqon;
      history.replace(`/${fqon}/hierarchy`);
      fetchOrgSet(fqon);
    };

    updateOrg(organization.properties.fqon, patches, onSuccess);
  }

  render() {
    const { organization, organizationPending, initialFormValues } = this.props;

    return (
      <Form
        component={HierarchyForm}
        title={organization.description || organization.name}
        loading={organizationPending}
        editMode
        onSubmit={this.update}
        initialValues={initialFormValues}
        validate={validate}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getEditOrganizationModel(state),
});

export default compose(
  withMetaResource,
  connect(mapStateToProps),
)(OrgEdit);

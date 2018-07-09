import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withOrganization } from 'Modules/MetaResource';
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
    organizationPending: PropTypes.bool.isRequired,
    organizationActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, organizationActions } = this.props;

    organizationActions.fetchOrg({ fqon: match.params.fqon });
  }

  update = (values) => {
    const { match, history, location, organization, organizationActions } = this.props;
    const payload = generateOrganizationPatches(organization, values);
    const onSuccess = (response) => {
      const fqon = location.state.card ? response.org.properties.fqon : match.params.fqon;
      history.replace(`/${fqon}/hierarchy`);
      organizationActions.fetchOrgSet({ fqon });
    };

    organizationActions.updateOrg({ fqon: organization.properties.fqon, payload, onSuccess });
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
        validate={validate()}
        mutators={{ ...arrayMutators }}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getEditOrganizationModel(state),
});

export default compose(
  withOrganization(),
  connect(mapStateToProps),
)(OrgEdit);

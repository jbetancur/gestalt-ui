import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateOrganizationPatches } from '../payloadTransformer';
import { getEditOrganizationModel } from '../selectors';
import withContext from '../hocs/withContext';

class OrgEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    selectedOrganization: PropTypes.object.isRequired,
    selectedOrganizationPending: PropTypes.bool.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, contextActions } = this.props;

    contextActions.fetchOrg({ fqon: match.params.fqon });
  }

  componentWillUnmount() {
    const { contextActions } = this.props;

    contextActions.unloadOrg();
  }

  update = (values) => {
    const { context: { organization }, location, history, selectedOrganization, contextActions } = this.props;
    const payload = generateOrganizationPatches(selectedOrganization, values);
    const onSuccess = (response) => {
      const fqon = location.state.card ? response.org.properties.fqon : organization.properties.fqon;
      history.replace(`/${fqon}/hierarchy`);
    };

    contextActions.updateOrg({ fqon: selectedOrganization.properties.fqon, payload, onSuccess });
  }

  render() {
    const { selectedOrganization, selectedOrganizationPending, initialFormValues } = this.props;

    return (
      selectedOrganizationPending
        ?
          <ActivityContainer centered id="organization-edit--loading" />
        :
          <Form
            component={HierarchyForm}
            title={selectedOrganization.description || selectedOrganization.name}
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
  withContext(),
  connect(mapStateToProps),
)(OrgEdit);

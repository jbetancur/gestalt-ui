import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ActivityContainer } from 'components/ProgressIndicators';
import HierarchyForm from './HierarchyForm';
import validate from '../validations';
import { generateOrganizationPatches } from '../payloadTransformer';
import { getEditOrganizationModel } from '../reducers/selectors';
import withContext from '../hocs/withContext';

class OrgEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { match, hierarchyContextActions } = this.props;

    hierarchyContextActions.fetchOrg({ fqon: match.params.fqon });
  }

  componentWillUnmount() {
    const { hierarchyContextActions } = this.props;

    hierarchyContextActions.unloadOrg();
  }

  update = (values) => {
    const { hierarchyContext, location, history, hierarchyContextActions } = this.props;
    const { context: { organization }, selectedOrganization, } = hierarchyContext;
    const payload = generateOrganizationPatches(selectedOrganization, values);
    const onSuccess = (response) => {
      const fqon = location.state.card ? response.org.properties.fqon : organization.properties.fqon;
      history.replace(`/${fqon}/hierarchy`);
    };

    hierarchyContextActions.updateOrg({ fqon: selectedOrganization.properties.fqon, payload, onSuccess });
  }

  render() {
    const { hierarchyContext, initialFormValues } = this.props;
    const { selectedOrganization, selectedOrganizationPending } = hierarchyContext;

    if (selectedOrganizationPending) {
      return <ActivityContainer centered id="organization-edit--loading" />;
    }

    return (
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

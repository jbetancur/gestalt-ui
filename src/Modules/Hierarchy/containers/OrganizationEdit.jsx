import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { mapTo2DArray } from 'util/helpers/transformations';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateOrganizationPatches } from '../payloadTransformer';

class OrgEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    fetchOrg: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    updateOrg: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    organizationPending: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    const { match, fetchOrg } = this.props;

    fetchOrg(match.params.fqon);
  }

  update(values) {
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
    const { t } = this.props;
    return (
      <HierarchyForm
        title={this.props.organization.description || this.props.organization.name}
        submitLabel={t('general.verbs.update')}
        cancelLabel={t('general.verbs.cancel')}
        onSubmit={values => this.update(values)}
        envMap={this.props.organization.properties.env}
        editMode
        pending={this.props.organizationPending}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { organization } = state.metaResource.organization;

  return {
    initialValues: {
      ...metaModels.organization,
      name: organization.name,
      description: organization.description,
      properties: {
        ...organization.properties,
        env: mapTo2DArray(organization.properties.env),
      },
    },
    enableReinitialize: true,
  };
}

export default compose(
  withMetaResource,
  translate(),
  connect(mapStateToProps),
  reduxForm({
    form: 'organizationEdit',
    validate
  }),
)(OrgEdit);

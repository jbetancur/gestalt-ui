import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { mapTo2DArray } from 'util/helpers/transformations';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';
import { generateOrganizationPatches } from '../../payloadTransformer';

class OrgEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    fetchOrg: PropTypes.func.isRequired,
    updateOrg: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    organizationPending: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    this.props.fetchOrg(this.props.match.params.fqon);
  }

  update(values) {
    const { history, organization, updateOrg } = this.props;
    const patches = generateOrganizationPatches(organization, values);
    const onSuccess = () => history.goBack();

    updateOrg(organization.properties.fqon, patches, onSuccess);
  }

  render() {
    const { t } = this.props;
    return (
      <HierarchyForm
        title={this.props.organization.description || this.props.organization.name}
        submitLabel={t('general.verbs.update')}
        cancelLabel={t('general.verbs.back')}
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

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'organizationEdit',
  validate
})(translate()(withContext(OrgEdit)))));

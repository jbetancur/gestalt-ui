import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import { withMetaResource, metaModels } from 'Modules/MetaResource';
import HierarchyForm from '../components/HierarchyForm';
import validate from '../validations';
import { generateOrganizationPayload } from '../payloadTransformer';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createOrg: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    organizationPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  create(values) {
    const { match, history, createOrg, fetchOrgSet } = this.props;
    const payload = generateOrganizationPayload(values);
    const onSuccess = () => {
      fetchOrgSet(match.params.fqon);
      history.replace(`/${match.params.fqon}/hierarchy`);
    };

    createOrg(match.params.fqon, payload, onSuccess);
  }

  render() {
    const { t } = this.props;
    return (
      <HierarchyForm
        title={t('organizations.actions.create')}
        submitLabel={t('general.verbs.create')}
        cancelLabel="Cancel"
        onSubmit={values => this.create(values)}
        pending={this.props.organizationPending}
        {...this.props}
      />
    );
  }
}

export default compose(
  withMetaResource,
  translate(),
  reduxForm({
    form: 'organizationCreate',
    initialValues: {
      ...metaModels.organization,
      properties: {
        env: [],
      }
    },
    validate,
  }),
)(OrgCreate);

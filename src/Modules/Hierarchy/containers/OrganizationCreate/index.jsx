import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';
import { generateOrganizationPayload } from '../../payloadTransformer';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createOrg: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    organizationPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  create(values) {
    const { match, history, createOrg } = this.props;
    const payload = generateOrganizationPayload(values);
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);

    createOrg(match.params.fqon, payload, onSuccess);
  }

  render() {
    const { t } = this.props;
    return (
      <HierarchyForm
        title={t('organizations.actions.create')}
        submitLabel={t('general.verbs.create')}
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.create(values)}
        pending={this.props.organizationPending}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { organization } = state.metaResource.organization;

  return {
    organization,
    initialValues: {
      name: '',
      description: '',
      properties: {
        env: [],
      }
    }
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'organizationCreate',
  validate
})(translate()(withContext(OrgCreate)))));

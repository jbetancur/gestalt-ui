import React, { Component, PropTypes } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { ContainmentForm, validate } from 'modules/ContainmentForm';
import { metaActions } from 'modules/MetaResource';
import * as actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createOrg: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  createOrg(values) {
    const payload = {
      name: values.name,
      description: values.description,
      properties: {
        env: {}
      }
    };

    if (values.variables) {
      values.variables.forEach((variable) => {
        payload.properties.env[variable.name] = variable.value;
      });
    }

    const onSuccess = response => this.props.router.push(`${response.properties.fqon}/organizations`);
    this.props.createOrg(this.props.params.fqon, payload, onSuccess);
  }

  render() {
    const { t } = this.props;
    return (
      <ContainmentForm
        title={t('organizations.actions.create')}
        submitLabel={t('general.verbs.create')}
        cancelLabel={t('general.verbs.cancel')}
        onSubmit={values => this.createOrg(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  const { organization, pending } = state.metaResource.organization;

  return {
    organization,
    pending,
    initialValues: {
      name: '',
      description: '',
      properties: {
        env: {}
      }
    }
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'organizationCreate',
  validate
})(translate()(OrgCreate)));

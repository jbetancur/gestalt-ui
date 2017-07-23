import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { arrayToMap } from 'util/helpers/transformations';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createOrg: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    organizationPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  createOrg(values) {
    const payload = {
      name: values.name,
      description: values.description,
      properties: {
        env: arrayToMap(values.properties.env, 'name', 'value'),
      }
    };

    const onSuccess = response => this.props.history.replace(`/${response.properties.fqon}/hierarchy`);
    this.props.createOrg(this.props.match.params.fqon, payload, onSuccess);
  }

  render() {
    const { t } = this.props;
    return (
      <HierarchyForm
        title={t('organizations.actions.create')}
        submitLabel={t('general.verbs.create')}
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.createOrg(values)}
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

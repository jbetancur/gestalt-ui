import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import HierarchyForm from '../../components/HierarchyForm';
import validate from '../../components/HierarchyForm/validations';
import actions from '../../actions';
import { generateWorkspacePayload } from '../../payloadTransformer';

class OrgCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createWorkspace: PropTypes.func.isRequired,
    workspacePending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  create(values) {
    const { match, history, createWorkspace } = this.props;
    const payload = generateWorkspacePayload(values);
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);

    createWorkspace(match.params.fqon, payload, onSuccess);
  }

  render() {
    return (
      <HierarchyForm
        title="Create Workspace"
        submitLabel="Create"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.create(values)}
        pending={this.props.workspacePending}
        {...this.props}
      />
    );
  }
}

function mapStateToProps() {
  return {
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
  form: 'workspaceCreate',
  validate
})(withContext(OrgCreate))));

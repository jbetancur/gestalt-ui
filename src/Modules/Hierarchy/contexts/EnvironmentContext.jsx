import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import EnvironmentRoutes from '../routes/EnvironmentRoutes';
import withContext from '../hocs/withContext';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      match,
      hierarchyContextActions,
    } = this.props;

    hierarchyContextActions.fetchContext({
      fqon: match.params.fqon,
      workspaceId: match.params.workspaceId,
      environmentId: match.params.environmentId,
      context: 'environment',
    });
  }

  componentDidUpdate(prevProps) {
    const { match, hierarchyContextActions } = this.props;

    if (match.params.environmentId && prevProps.match.params.environmentId !== match.params.environmentId) {
      // If the envirnment is switched then get the updated context
      hierarchyContextActions.fetchContext({
        fqon: match.params.fqon,
        workspaceId: match.params.workspaceId,
        environmentId: match.params.environmentId,
        context: 'environment',
      });
    }
  }

  render() {
    return <EnvironmentRoutes />;
  }
}

export default compose(
  withContext(),
)(EnvironmentContext);

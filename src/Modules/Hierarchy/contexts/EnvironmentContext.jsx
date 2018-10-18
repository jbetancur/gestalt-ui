import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Div from 'components/Div';
import EnvironmentRoutes from '../routes/EnvironmentRoutes';
import ContextNavigation from '../containers/ContextNavigation';
import withContext from '../hocs/withContext';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const {
      match,
      contextActions,
    } = this.props;

    contextActions.fetchContext({
      fqon: match.params.fqon,
      workspaceId: match.params.workspaceId,
      environmentId: match.params.environmentId,
      context: 'environment',
    });
  }

  componentDidUpdate(prevProps) {
    const { match, contextActions } = this.props;

    if (match.params.environmentId && prevProps.match.params.environmentId !== match.params.environmentId) {
      // If the envirnment is switched then get the updated context
      contextActions.fetchContext({
        fqon: match.params.fqon,
        workspaceId: match.params.workspaceId,
        environmentId: match.params.environmentId,
        context: 'environment',
      });
    }
  }

  render() {
    return (
      <Div paddingBottom="56px">
        <ContextNavigation {...this.props} />
        <EnvironmentRoutes />
      </Div>
    );
  }
}

export default compose(
  withContext(),
)(EnvironmentContext);

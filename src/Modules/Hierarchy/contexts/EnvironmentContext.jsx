import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Div from 'components/Div';
import EnvironmentRoutes from '../routes/EnvironmentRoutes';
import EnvironmentHeader from '../containers/EnvironmentHeader';
import withContext from '../hocs/withContext';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
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
    const { context: { environment } } = this.props;

    return (
      <Div paddingBottom="56px">
        <EnvironmentHeader
          model={environment}
          {...this.props}
        />
        <EnvironmentRoutes />
      </Div>
    );
  }
}

export default compose(
  withContext(),
)(EnvironmentContext);

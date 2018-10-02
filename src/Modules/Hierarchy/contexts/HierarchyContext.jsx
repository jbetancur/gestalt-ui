import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Div from 'components/Div';
import HierarchyRoutes from '../routes/HierarchyRoutes';
import ContextHeader from '../containers/ContextHeader';
import withContext from '../hocs/withContext';

class HierarchyContext extends PureComponent {
  static propTypes = {
    context: PropTypes.object.isRequired,
    contextPending: PropTypes.bool.isRequired,
    contextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, contextActions } = this.props;
    contextActions.fetchContext({ fqon: match.params.fqon });
  }

  componentDidUpdate(prevProps) {
    const { match, contextActions } = this.props;

    if (match.params.fqon && prevProps.match.params.fqon !== match.params.fqon) {
      // If we change the org let's update the context and clear out the old the state tree for workspaces/environments
      contextActions.fetchContext({ fqon: match.params.fqon });
    }
  }

  render() {
    return (
      <Div paddingBottom="56px">
        <ContextHeader {...this.props} />
        <HierarchyRoutes />
      </Div>
    );
  }
}

export default compose(
  withContext(),
)(HierarchyContext);

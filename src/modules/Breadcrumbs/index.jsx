import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Breadcrumbs extends Component {
  static propTypes = {
    currentOrgContext: PropTypes.object.isRequired,
    currentWorkspaceContext: PropTypes.object.isRequired,
    currentEnvironmentContext: PropTypes.object.isRequired,
  };

  render() {
    return (
      <span>
        <span>
          {this.props.currentOrgContext.description || this.props.currentOrgContext.name}
        </span>
        {this.props.currentWorkspaceContext.id ?
          <span>  / {this.props.currentWorkspaceContext.description || this.props.currentWorkspaceContext.name}
          </span> : null}
        {this.props.currentEnvironmentContext.id ?
          <span>  / {this.props.currentEnvironmentContext.description || this.props.currentEnvironmentContext.name}
          </span> : null}
      </span>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentOrgContext: state.app.currentOrgContext.organization,
    currentWorkspaceContext: state.app.currentWorkspaceContext.workspace,
    currentEnvironmentContext: state.app.currentEnvironmentContext.environment,
  };
}

export default connect(mapStateToProps)(Breadcrumbs);

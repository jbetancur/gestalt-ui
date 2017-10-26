import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withContext } from 'Modules/ContextManagement';
import Div from 'components/Div';
import EnvironmentRoutes from '../routes/EnvironmentRoutes';
import EnvironmentNav from '../components/EnvironmentNav';
import EnvironmentHeader from '../components/EnvironmentHeader';
import actions from '../actions';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    environment: PropTypes.object.isRequired,
    unloadContainers: PropTypes.func.isRequired,
    unloadLambdas: PropTypes.func.isRequired,
    unloadAPIs: PropTypes.func.isRequired,
    unloadPolicies: PropTypes.func.isRequired,
    unloadProviders: PropTypes.func.isRequired,
    unloadSecrets: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match, fetchEnvironment, fetchContextActions } = this.props;

    fetchEnvironment(match.params.fqon, match.params.environmentId);
    fetchContextActions(match.params.fqon, match.params.environmentId, 'environments', { filter: ['environment.list', 'environment.detail'] });
  }


  componentWillUnmount() {
    // only clear state when the Environment Context changes - this acts as a cache
    const { unloadContainers, unloadLambdas, unloadAPIs, unloadPolicies, unloadProviders, unloadSecrets } = this.props;

    unloadContainers();
    unloadLambdas();
    unloadAPIs();
    unloadPolicies();
    unloadProviders();
    unloadSecrets();
  }

  render() {
    const { environment } = this.props;

    return (
      <Div>
        <EnvironmentNav />
        <Div paddingLeft="5em">
          <EnvironmentHeader
            model={environment}
            {...this.props}
          />
          <EnvironmentRoutes />
        </Div>
      </Div>
    );
  }
}

export default connect(null, actions)(withMetaResource(withContext(EnvironmentContext)));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withContext } from 'Modules/ContextManagement';
import { Providers } from 'Modules/Providers';
import { Lambdas } from 'Modules/Lambdas';
import { Containers } from 'Modules/Containers';
import { Policies } from 'Modules/Policies';
import { Secrets } from 'Modules/Secrets';
import Integrations from 'Modules/Integrations';
import { APIs } from 'Modules/APIs';
import Div from 'components/Div';
import EnvironmentNav from '../components/EnvironmentNav';
import EnvironmentHeader from '../components/EnvironmentHeader';
import actions from '../actions';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    environment: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match, fetchEnvironment, fetchContextActions } = this.props;

    fetchEnvironment(match.params.fqon, match.params.environmentId);
    fetchContextActions(match.params.fqon, match.params.environmentId, 'environments', { filter: ['environment.list', 'environment.detail'] });
  }

  renderThings(state) {
    switch (state) {
      case 'containers':
        return (
          <Containers {...this.props} />
        );
      case 'apis':
        return (
          <APIs {...this.props} />
        );
      case 'lambdas':
        return (
          <Lambdas {...this.props} />
        );
      case 'providers':
        return (
          <Providers {...this.props} />
        );
      case 'policies':
        return (
          <Policies {...this.props} />
        );
      case 'secrets':
        return (
          <Secrets {...this.props} />
        );
      case 'integrations':
        return (
          <Integrations {...this.props} />
        );
      default:
        return <div />;
    }
  }

  render() {
    const { navigation, handleNavigation, environment } = this.props;

    return (
      <Div>
        <EnvironmentNav
          navigation={navigation}
          handleNavigation={handleNavigation}
        />
        <Div paddingLeft="5em">
          <EnvironmentHeader
            model={environment}
            {...this.props}
          />
          {this.renderThings(navigation.view)}
        </Div>
      </Div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.hierarchy.environmentContextNavigation,
  };
}

export default connect(mapStateToProps, actions)(withMetaResource(withContext(EnvironmentContext)));

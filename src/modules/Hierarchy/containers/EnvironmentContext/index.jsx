import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'modules/MetaResource';
import { withContext } from 'modules/ContextManagement';
import { Providers } from 'modules/Providers';
import { Lambdas } from 'modules/Lambdas';
import { Containers } from 'modules/Containers';
import { Policies } from 'modules/Policies';
import Integrations from 'modules/Integrations';
import { APIs } from 'modules/APIs';
import Div from 'components/Div';
import EnvironmentNav from '../../components/EnvironmentNav';
import EnvironmentHeader from '../../components/EnvironmentHeader';
import actions from '../../actions';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    // fetchContextActions: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    environment: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match, fetchEnvironment } = this.props;

    fetchEnvironment(match.params.fqon, match.params.environmentId);
    // fetchContextActions(match.params.fqon, match.params.environmentId, 'environments', { filter: ['environment.list', 'environment.detail'] });
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

const bindActions = Object.assign({}, actions);

export default withMetaResource(connect(mapStateToProps, bindActions)(withContext(EnvironmentContext)));

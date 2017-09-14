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
import ListItemStacked from 'components/ListItemStacked';
import { LambdaIcon } from 'components/Icons';
import Div from 'components/Div';
import Navbar from 'components/Navbar';
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

  renderNavItems() {
    const { navigation, handleNavigation } = this.props;

    return [
      <ListItemStacked
        key="environment--containers"
        icon="memory"
        title="Containers"
        onClick={() => handleNavigation('environment', 'containers', 0)}
        className={navigation.index === 0 && 'active-link'}
      />,
      <ListItemStacked
        key="environment--lambdas"
        icon={<LambdaIcon />}
        title="Lambdas"
        onClick={() => handleNavigation('environment', 'lambdas', 1)}
        className={navigation.index === 1 && 'active-link'}
      />,
      <ListItemStacked
        key="environment--apis"
        icon="device_hub"
        title="APIs"
        onClick={() => handleNavigation('environment', 'apis', 2)}
        className={navigation.index === 2 && 'active-link'}
      />,
      <ListItemStacked
        key="environment--policies"
        icon="verified_user"
        title="Policies"
        onClick={() => handleNavigation('environment', 'policies', 3)}
        className={navigation.index === 3 && 'active-link'}
      />,
      <ListItemStacked
        key="environment--providers"
        icon="settings_applications"
        title="Providers"
        onClick={() => handleNavigation('environment', 'providers', 4)}
        className={navigation.index === 4 && 'active-link'}
      />,
    ];
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
    const { navigation, environment } = this.props;

    return (
      <Div>
        <Navbar
          vertical
          items={this.renderNavItems()}
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

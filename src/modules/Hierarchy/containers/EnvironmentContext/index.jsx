import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { appActions } from 'App';
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

  handleViewState(view, index) {
    const { handleNavigation } = this.props;

    handleNavigation('environment', view, index);
  }

  renderNavItems() {
    const { navigation } = this.props;

    return [
      <ListItemStacked
        icon="memory"
        title="Containers"
        onClick={() => this.handleViewState('containers', 0)}
        className={navigation.index === 0 && 'active-link'}
      />,
      <ListItemStacked
        icon={<LambdaIcon />}
        title="Lambdas"
        onClick={() => this.handleViewState('lambdas', 1)}
        className={navigation.index === 1 && 'active-link'}
      />,
      <ListItemStacked
        icon="device_hub"
        title="APIs"
        onClick={() => this.handleViewState('apis', 2)}
        className={navigation.index === 2 && 'active-link'}
      />,
      <ListItemStacked
        icon="verified_user"
        title="Policies"
        onClick={() => this.handleViewState('policies', 3)}
        className={navigation.index === 3 && 'active-link'}
      />,
      <ListItemStacked
        icon="settings_applications"
        title="Providers"
        onClick={() => this.handleViewState('providers', 4)}
        className={navigation.index === 4 && 'active-link'}
      />,
      // <ListItemStacked
      //   icon="lock"
      //   title="Secrets"
      //   onClick={() => this.handleViewState('secrets', 5)}
      //   className={navigation.index === 5 && 'active-link'}
      // />,
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

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, appActions))(withContext(EnvironmentContext)));

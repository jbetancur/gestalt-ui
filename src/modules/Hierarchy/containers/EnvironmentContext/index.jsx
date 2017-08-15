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
import { ProviderIcon, LambdaIcon } from 'components/Icons';
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
        icon="developer_board"
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
        icon={<ProviderIcon />}
        title="Providers"
        onClick={() => this.handleViewState('providers', 4)}
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
    const { navigation } = this.props;

    return (
      <Div>
        <EnvironmentHeader {...this.props} />
        <Div position="relative">
          <Navbar
            vertical
            items={this.renderNavItems()}
          />
          <Div style={{ paddingLeft: '4.2em' }}>
            {this.renderThings(navigation.view)}
          </Div>
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

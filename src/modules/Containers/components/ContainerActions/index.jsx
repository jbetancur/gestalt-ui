import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import ActionsModals from '../../ActionModals';

const ActionsWrapper = styled.div`
    display: inline-block;

    &.action--title {
      padding-left: .3em;
      position: absolute;
      right: 2em;
      top: .7em;
    }

    .container--RUNNING {
      color: #4CAF50;
    }

    .container--LAUNCHED {
      color: #4CAF50;
    }

    .container--HEALTHY {
      color: #607D8B;
    }

    .container--UNHEALTHY {
      color: #795548;
    }

    .container--SCALING {
      color: #2196F3
    }

    .container--SUSPENDED {
      color: #FFC107;
    }

    .container--LOST {
      color: #F44336;
    }

    .container--ERROR {
      color: #F44336;
    }

    .button--suspend * {
      color: #FFC107;
    }

    .button--scale * {
      color: #2196F3;
    }

    .button--destroy * {
      color: #F44336;
    }
`;

const ListWrapper = styled.div`
  min-width: 10em;
`;

const ListMenu = styled.div`
  padding-left: .5em;
  padding-right: .5em;
`;

const EnhancedDivider = styled(Divider)`
  margin: 0;
`;

class ContainerActions extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    deleteContainer: PropTypes.func.isRequired,
    scaleContainer: PropTypes.func.isRequired,
    scaleContainerModal: PropTypes.func.isRequired,
    migrateContainer: PropTypes.func.isRequired,
    fetchContainers: PropTypes.func.isRequired,
    fetchContainer: PropTypes.func.isRequired,
    migrateContainerModal: PropTypes.func.isRequired,
    promoteContainer: PropTypes.func.isRequired,
    promoteContainerModal: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    setCurrentEnvironmentContext: PropTypes.func.isRequired,
    inContainerView: PropTypes.bool,
    disableDestroy: PropTypes.bool,
    disablePromote: PropTypes.bool,
  }

  static defaultProps = {
    inContainerView: false,
    disableDestroy: false,
    disablePromote: false,
  }

  constructor(props) {
    super(props);
  }

  destroyContainer() {
    const { params, router, confirmDelete, fetchContainers, deleteContainer, container, inContainerView } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        router.goBack();
      } else {
        fetchContainers(params.fqon, params.environmentId);
      }
    };

    confirmDelete(() => {
      deleteContainer(params.fqon, container.id, onSuccess);
    }, container.name);
  }

  suspendContainer() {
    const { params, fetchContainer, fetchContainers, scaleContainer, container, inContainerView } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        fetchContainer(params.fqon, container.id, params.environmentId, true);
      } else {
        fetchContainers(params.fqon, params.environmentId);
      }
    };

    scaleContainer(params.fqon, container.id, 0, onSuccess);
  }

  scaleContainer() {
    const { params, fetchContainer, fetchContainers, scaleContainer, scaleContainerModal, container, inContainerView } = this.props;
    const onSuccess = () => {
      if (inContainerView) {
        fetchContainer(params.fqon, container.id, params.environmentId, true);
      } else {
        fetchContainers(params.fqon, params.environmentId);
      }
    };

    scaleContainerModal((numInstances) => {
      if (numInstances !== container.properties.num_instances) {
        scaleContainer(params.fqon, container.id, numInstances, onSuccess);
      }
    }, container.name, container.properties.num_instances);
  }

  migrateContainer() {
    const { params, fetchContainer, fetchContainers, migrateContainer, migrateContainerModal, container, inContainerView } = this.props;
    const onSuccess = () => {
      if (inContainerView) {
        fetchContainer(params.fqon, container.id, params.environmentId, true);
      } else {
        fetchContainers(params.fqon, params.environmentId);
      }
    };

    migrateContainerModal((providerId) => {
      migrateContainer(params.fqon, container.id, providerId, onSuccess);
    }, container.name, container.properties.provider, params);
  }

  promoteContainer() {
    const { params, promoteContainer, promoteContainerModal, container, setCurrentEnvironmentContext, fetchEnvironment, fetchContainers } = this.props;
    const onSuccess = environment => () => {
      this.props.router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${environment.id}`);
      fetchEnvironment(params.fqon, environment.id);
      setCurrentEnvironmentContext(environment);
      fetchContainers(params.fqon, environment.id);
      // TODO: If we can better catch when a promote fails (ie mock/broken promote policy) then we can implement below
      // if (inContainerView) {
      //   this.props.router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${environment.id}/containers/${container.id}/edit`);
      //   setCurrentEnvironmentContext(environment);
      //   fetchContainer(params.fqon, container.id, environment.id, true);
      // } else {
      //   // TODO: Need to refactor this when we refactor the routing logic
      //   this.props.router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${environment.id}`);
      //   fetchEnvironment(params.fqon, environment.id);
      //   setCurrentEnvironmentContext(environment);
      //   fetchContainers(params.fqon, environment.id);
      // }
    };

    promoteContainerModal((environment) => {
      promoteContainer(params.fqon, container.id, environment.id, onSuccess(environment));
    }, container.name, params);
  }

  render() {
    return (
      <ActionsWrapper className={this.props.inContainerView && 'action--title'}>
        <ActionsModals />
        <MenuButton
          className={`container--${this.props.container.properties.status}`}
          id="container-actions-menu"
          icon={!this.props.inContainerView}
          flat={this.props.inContainerView}
          label={this.props.inContainerView && this.props.container.properties.status}
          buttonChildren="more_vert"
          position={this.props.inContainerView ? MenuButton.Positions.TOP_RIGHT : MenuButton.Positions.BOTTOM_LEFT}
          tooltipLabel={!this.props.inContainerView && 'Actions'}
        >
          {/* https://github.com/mlaursen/react-md/issues/259 */}
          {[<ListWrapper key="container-actions-menu">
            <ListMenu>
              <div className="gf-headline-1">{this.props.container.name}</div>
              <div className="gf-subtitle">{this.props.container.properties.status}</div>
            </ListMenu>
            <EnhancedDivider />
            <ListItem className="button--suspend" primaryText="Suspend" onClick={() => this.suspendContainer()} />
            <ListItem className="button--scale" primaryText="Scale" onClick={() => this.scaleContainer()} />
            <ListItem primaryText="Migrate" onClick={() => this.migrateContainer()} />
            {!this.props.disablePromote &&
              <ListItem primaryText="Promote" onClick={() => this.promoteContainer()} />}
            {!this.props.disableDestroy &&
            <ListItem className="button--destroy" primaryText="Destroy" onClick={() => this.destroyContainer()} />}
          </ListWrapper>]}
        </MenuButton>
      </ActionsWrapper>
    );
  }
}

export default ContainerActions;

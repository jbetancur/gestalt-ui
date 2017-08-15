import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import { ActionsMenu } from 'modules/Actions';
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
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    containerModel: PropTypes.object.isRequired,
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
    actions: PropTypes.array.isRequired,
    actionsPending: PropTypes.bool.isRequired,
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
    const { match, history, confirmDelete, fetchContainers, deleteContainer, containerModel, inContainerView } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        history.goBack();
      } else {
        fetchContainers(match.params.fqon, match.params.environmentId);
      }
    };

    confirmDelete(() => {
      deleteContainer(match.params.fqon, containerModel.id, onSuccess);
    }, containerModel.name);
  }

  suspendContainer() {
    const { match, fetchContainer, fetchContainers, scaleContainer, containerModel, inContainerView } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        fetchContainer(match.params.fqon, containerModel.id, match.params.environmentId, true);
      } else {
        fetchContainers(match.params.fqon, match.params.environmentId);
      }
    };

    scaleContainer(match.params.fqon, containerModel.id, 0, onSuccess);
  }

  scaleContainer() {
    const { match, fetchContainer, fetchContainers, scaleContainer, scaleContainerModal, containerModel, inContainerView } = this.props;
    const onSuccess = () => {
      if (inContainerView) {
        fetchContainer(match.params.fqon, containerModel.id, match.params.environmentId, true);
      } else {
        fetchContainers(match.params.fqon, match.params.environmentId);
      }
    };

    scaleContainerModal((numInstances) => {
      if (numInstances !== containerModel.properties.num_instances) {
        scaleContainer(match.params.fqon, containerModel.id, numInstances, onSuccess);
      }
    }, containerModel.name, containerModel.properties.num_instances);
  }

  migrateContainer() {
    const { match, fetchContainer, fetchContainers, migrateContainer, migrateContainerModal, containerModel, inContainerView } = this.props;
    const onSuccess = () => {
      if (inContainerView) {
        fetchContainer(match.params.fqon, containerModel.id, match.params.environmentId, true);
      } else {
        fetchContainers(match.params.fqon, match.params.environmentId);
      }
    };

    migrateContainerModal((providerId) => {
      migrateContainer(match.params.fqon, containerModel.id, providerId, onSuccess);
    }, containerModel.name, containerModel.properties.provider, match.params);
  }

  promoteContainer() {
    const { match, promoteContainer, promoteContainerModal, containerModel, setCurrentEnvironmentContext, fetchEnvironment, fetchContainers } = this.props;
    const onSuccess = environment => () => {
      this.props.history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${environment.id}`);
      fetchEnvironment(match.params.fqon, environment.id);
      setCurrentEnvironmentContext(environment);
      fetchContainers(match.params.fqon, environment.id);
      // TODO: If we can better catch when a promote fails (ie mock/broken promote policy) then we can implement below
      // if (inContainerView) {
      //   this.props.history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${environment.id}/containers/${container.id}/edit`);
      //   setCurrentEnvironmentContext(environment);
      //   fetchContainer(match.params.fqon, container.id, environment.id, true);
      // } else {
      //   // TODO: Need to refactor this when we refactor the routing logic
      //   this.props.history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${environment.id}`);
      //   fetchEnvironment(match.params.fqon, environment.id);
      //   setCurrentEnvironmentContext(environment);
      //   fetchContainers(match.params.fqon, environment.id);
      // }
    };

    promoteContainerModal((environment) => {
      promoteContainer(match.params.fqon, containerModel.id, environment.id, onSuccess(environment));
    }, containerModel.name, match.params);
  }

  render() {
    return (
      <ActionsWrapper className={this.props.inContainerView && 'action--title'}>
        <ActionsModals />
        <MenuButton
          className={`container--${this.props.containerModel.properties.status}`}
          id="container-actions-menu"
          icon={!this.props.inContainerView}
          flat={this.props.inContainerView}
          label={this.props.inContainerView && this.props.containerModel.properties.status}
          buttonChildren="more_vert"
          position={this.props.inContainerView ? MenuButton.Positions.TOP_RIGHT : MenuButton.Positions.BOTTOM_LEFT}
          tooltipLabel={!this.props.inContainerView && 'Actions'}
        >
          {/* https://github.com/mlaursen/react-md/issues/259 */}
          {[<ListWrapper key="container-actions-menu">
            <ListMenu>
              <div className="gf-headline-1">{this.props.containerModel.name}</div>
              <div className="gf-subtitle">{this.props.containerModel.properties.status}</div>
            </ListMenu>
            <EnhancedDivider />
            <ListItem className="button--suspend" primaryText="Suspend" onClick={() => this.suspendContainer()} />
            <ListItem className="button--scale" primaryText="Scale" onClick={() => this.scaleContainer()} />
            <ListItem primaryText="Migrate" onClick={() => this.migrateContainer()} />
            {!this.props.disablePromote &&
              <ListItem primaryText="Promote" onClick={() => this.promoteContainer()} />}
            {!this.props.disableDestroy &&
              <ListItem className="button--destroy" primaryText="Destroy" onClick={() => this.destroyContainer()} />}
            <ActionsMenu
              listItem
              model={this.props.containerModel}
              actionList={this.props.actions}
              pending={this.props.actionsPending}
            />
          </ListWrapper>]}
        </MenuButton>
      </ActionsWrapper>
    );
  }
}

export default ContainerActions;

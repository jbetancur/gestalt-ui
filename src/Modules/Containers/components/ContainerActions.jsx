import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import { withMetaResource } from 'Modules/MetaResource';
import { MenuButton, ListItem, Divider } from 'react-md';
import { ActionsMenu } from 'Modules/Actions';
import StatusBubble from 'components/StatusBubble';
import { generateContextEntityState } from 'util/helpers/context';
import actionCreators from '../actions';

const ActionsWrapper = styled.div`
    display: inline-block;

    &.action--title {
      padding-left: .3em;
      position: absolute;
      right: .3em;
      top: .7em;
    }

    .button--suspend * {
      color: ${props => props.theme.colors['$md-orange-500']};;
    }

    .button--scale * {
      color: ${props => props.theme.colors['$md-blue-500']};
    }

    .button--destroy * {
      color: ${props => props.theme.colors['$md-red-a400']};
    }

    button {
      &:hover {
        background-color: transparent;
      }
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
    confirmContainerDelete: PropTypes.func.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
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

  populateContainers() {
    const { match, fetchContainers } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchContainers(match.params.fqon, entity.id, entity.key);
  }

  populateContainer() {
    const { match, fetchContainer, containerModel } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchContainer(match.params.fqon, containerModel.id, entity.id, entity.key, true);
  }

  destroy = () => {
    const { match, history, confirmContainerDelete, deleteContainer, containerModel, inContainerView } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`);
      } else {
        this.populateContainers();
      }
    };

    confirmContainerDelete(() => {
      deleteContainer(match.params.fqon, containerModel.id, onSuccess);
    }, containerModel.name);
  }

  suspend = () => {
    const { match, scaleContainer, containerModel, inContainerView } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        this.populateContainer();
      } else {
        this.populateContainers();
      }
    };

    scaleContainer(match.params.fqon, containerModel.id, 0, onSuccess);
  }

  scale = () => {
    const { match, scaleContainer, scaleContainerModal, containerModel, inContainerView } = this.props;
    const onSuccess = () => {
      if (inContainerView) {
        this.populateContainer();
      } else {
        this.populateContainers();
      }
    };

    scaleContainerModal((numInstances) => {
      if (numInstances !== containerModel.properties.num_instances) {
        scaleContainer(match.params.fqon, containerModel.id, numInstances, onSuccess);
      }
    }, containerModel.name, containerModel.properties.num_instances);
  }

  migrate = () => {
    const { match, migrateContainer, migrateContainerModal, containerModel, inContainerView } = this.props;
    const onSuccess = () => {
      if (inContainerView) {
        this.populateContainer();
      } else {
        this.populateContainers();
      }
    };

    migrateContainerModal((providerId) => {
      migrateContainer(match.params.fqon, containerModel.id, providerId, onSuccess);
    }, containerModel.name, containerModel.properties.provider);
  }

  promote = () => {
    const { match, promoteContainer, promoteContainerModal, containerModel, fetchEnvironment } = this.props;
    // reroute and force immediate containers call to populate
    const onSuccess = environment => () => {
      this.props.history.replace(`/${match.params.fqon}/hierarchy/${environment.properties.workspace.id}/environment/${environment.id}/containers`);
      fetchEnvironment(match.params.fqon, environment.id);
      this.populateContainers();
    };

    promoteContainerModal((environment) => {
      promoteContainer(match.params.fqon, containerModel.id, environment.id, onSuccess(environment));
    }, containerModel.name, match.params);
  }

  render() {
    const {
      inContainerView,
      containerModel,
      disablePromote,
      disableDestroy,
      actions,
      actionsPending,
    } = this.props;

    return (
      <ActionsWrapper className={inContainerView && 'action--title'}>
        <MenuButton
          id="container-actions-menu"
          icon={!inContainerView}
          flat={inContainerView}
          label={inContainerView && <StatusBubble status={containerModel.properties.status || 'Pending'} />}
          disabled={!containerModel.properties.status}
          iconChildren="more_vert"
          position={inContainerView ? MenuButton.Positions.TOP_RIGHT : MenuButton.Positions.BOTTOM_LEFT}
          tooltipLabel={!inContainerView && 'Actions'}
          inkDisabled={inContainerView}
        >
          {/* https://github.com/mlaursen/react-md/issues/259 */}
          {[
            <ListWrapper key="container-actions-menu--dropdown">
              <ListMenu>
                <div className="gf-headline-1">{containerModel.name}</div>
                <div className="gf-subtitle">{containerModel.properties.status}</div>
              </ListMenu>
              <EnhancedDivider />
              <ListItem className="button--suspend" primaryText="Suspend" onClick={this.suspend} />
              <ListItem className="button--scale" primaryText="Scale" onClick={this.scale} />
              <ListItem primaryText="Migrate" onClick={this.migrate} />
              {!disablePromote &&
                <ListItem primaryText="Promote" onClick={this.promote} />}
              {!disableDestroy &&
                <ListItem className="button--destroy" primaryText="Destroy" onClick={this.destroy} />}
              <ActionsMenu
                listItem
                model={containerModel}
                actionList={actions}
                pending={actionsPending}
              />
            </ListWrapper>
          ]}
        </MenuButton>
      </ActionsWrapper>
    );
  }
}

export default compose(
  withMetaResource,
  withTheme,
  withRouter,
  connect(null, Object.assign({}, actionCreators)),
)(ContainerActions);

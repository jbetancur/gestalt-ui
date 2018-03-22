import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MenuButton, ListItem, Divider, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActionsMenu } from 'Modules/Actions';
import StatusBubble from 'components/StatusBubble';
import { Title, Subtitle } from 'components/Typography';
import { generateContextEntityState } from 'util/helpers/context';
import actionCreators from '../actions';

const dividerStyle = { borderRight: '1px solid #e0e0e0' };
const ActionsWrapper = styled.div`
  display: inline-block;

  &.action--title {
    padding-left: 0.3em;
    position: absolute;
    right: 0.3em;
    top: 0.7em;
  }

  .button--start * {
    color: ${props => props.theme.colors['$md-green-500']};
  }

  .button--start[disabled] * {
    color: ${props => props.theme.colors['$md-grey-500']};
  }

  .button--suspend * {
    color: ${props => props.theme.colors['$md-orange-500']};
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
  min-width: 300px;
`;

const ListMenu = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

const EnhancedDivider = styled(Divider)`
  margin: 0;
`;

class ContainerActions extends PureComponent {
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
    entitlementActions: PropTypes.object.isRequired,
    editURL: PropTypes.string,
  }

  static defaultProps = {
    inContainerView: false,
    disableDestroy: false,
    disablePromote: false,
    editURL: null,
  }

  handleEntitlements = () => {
    const { match, entitlementActions, containerModel } = this.props;

    entitlementActions.showEntitlementsModal(containerModel.name, match.params.fqon, containerModel.id, 'containers', 'Container');
  };

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

  start = () => {
    const { match, scaleContainer, containerModel, inContainerView } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        this.populateContainer();
      } else {
        this.populateContainers();
      }
    };

    scaleContainer(match.params.fqon, containerModel.id, 1, onSuccess);
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
        this.props.history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`);
      } else {
        this.populateContainers();
      }
    };

    migrateContainerModal((providerId) => {
      migrateContainer(match.params.fqon, containerModel.id, providerId, onSuccess);
    }, containerModel.name, containerModel.properties.provider, inContainerView);
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

    const menuItems = [
      <ListWrapper key="container-actions-menu--dropdown">

        <Row>
          <Col flex={12}>
            <ListMenu>
              <Title>{containerModel.name}</Title>
              <Subtitle>{containerModel.properties.status}</Subtitle>
            </ListMenu>

            <EnhancedDivider />
          </Col>

          <Col flex={6} style={dividerStyle}>
            <ListItem className="button--start" primaryText="Start" onClick={this.start} />
            <ListItem className="button--suspend" primaryText="Suspend" onClick={this.suspend} />
            <ListItem className="button--scale" primaryText="Scale" onClick={this.scale} />
            <ListItem primaryText="Migrate" onClick={this.migrate} />
            {!disablePromote &&
              <ListItem primaryText="Promote" onClick={this.promote} />}
            {!disableDestroy &&
              <ListItem className="button--destroy" primaryText="Destroy" onClick={this.destroy} />}

          </Col>

          <Col flex={6}>
            {!inContainerView ?
              <ListItem
                key="container--edit"
                primaryText="Edit"
                leftIcon={<FontIcon>edit</FontIcon>}
                to={this.props.editURL}
                component={Link}
              /> : <div />}
            <ListItem
              key="container--entitlements"
              primaryText="Entitlements"
              leftIcon={<FontIcon>security</FontIcon>}
              onClick={this.handleEntitlements}
            />
            <CopyToClipboard
              key="container--copyuuid"
              text={containerModel.id}
            >
              <ListItem
                primaryText="Copy uuid"
                leftIcon={<FontIcon>content_copy</FontIcon>}
              />
            </CopyToClipboard>

            <ActionsMenu
              listItem
              model={containerModel}
              actionList={actions}
              pending={actionsPending}
            />
          </Col>
        </Row>
      </ListWrapper>
    ];

    const icon = inContainerView ? null : 'more_vert';
    const positionX = inContainerView ? 'INNER_RIGHT' : 'INNER_LEFT';

    return (
      containerModel.id ?
        <ActionsWrapper className={inContainerView && 'action--title'}>
          <MenuButton
            id="container-actions-menu"
            icon={!inContainerView}
            flat={inContainerView}
            disabled={!containerModel.properties.status}
            iconChildren={icon}
            tooltipLabel={!inContainerView && 'Actions'}
            inkDisabled={inContainerView}
            menuItems={menuItems}
            listHeightRestricted={false}
            simplifiedMenu={false}
            repositionOnScroll={false}
            anchor={{
              x: MenuButton.HorizontalAnchors[positionX],
              y: MenuButton.VerticalAnchors.OVERLAP,
            }}
            primary
          >
            {inContainerView && <StatusBubble status={containerModel.properties.status || 'Pending'} />}
          </MenuButton>
        </ActionsWrapper> : null
    );
  }
}

export default compose(
  withMetaResource,
  withEntitlements,
  withTheme,
  withRouter,
  connect(null, Object.assign({}, actionCreators)),
)(ContainerActions);

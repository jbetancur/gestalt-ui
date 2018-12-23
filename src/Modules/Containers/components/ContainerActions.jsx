import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ListItem, Divider, FontIcon } from 'react-md';
import { withEntitlements } from 'Modules/Entitlements';
import { StatusButton } from 'components/Status';
import { Title, Subtitle } from 'components/Typography';
import { generateContextEntityState } from 'util/helpers/context';
import actionCreators from '../actions';
import withContext from '../../Hierarchy/hocs/withContext';
import withContainer from '../hocs/withContainer';
import withContainers from '../hocs/withContainers';

const dividerStyle = { borderRight: '1px solid #e0e0e0' };
const ActionsWrapper = styled.div`
  display: inline-block;

  .container-action-button {
    .md-text--disabled {
      color: ${props => props.theme.colors['$md-grey-500']} !important;
    }
  }

  .button--start * {
    color: ${props => props.theme.colors['$md-green-500']};
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
    scaleContainerModal: PropTypes.func.isRequired,
    containerActions: PropTypes.object.isRequired,
    containersActions: PropTypes.object.isRequired,
    migrateContainerModal: PropTypes.func.isRequired,
    promoteContainerModal: PropTypes.func.isRequired,
    confirmContainerDelete: PropTypes.func.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    inContainerView: PropTypes.bool,
    disableDestroy: PropTypes.bool,
    disablePromote: PropTypes.bool,
    // actions: PropTypes.array.isRequired,
    // actionsPending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    editURL: PropTypes.string,
    onStart: PropTypes.func,
    onDestroy: PropTypes.func,
    onSuspend: PropTypes.func,
    onScale: PropTypes.func,
    onMigrate: PropTypes.func,
    onPromote: PropTypes.func,
  }

  static defaultProps = {
    inContainerView: false,
    disableDestroy: false,
    disablePromote: false,
    editURL: null,
    onStart: () => {},
    onDestroy: () => {},
    onSuspend: () => {},
    onScale: () => {},
    onMigrate: () => {},
    onPromote: () => {},
  }

  handleEntitlements = () => {
    const { match, entitlementActions, containerModel } = this.props;

    entitlementActions.showEntitlementsModal(containerModel.name, match.params.fqon, containerModel.id, 'containers', 'Container');
  };

  populateContainers() {
    const { match, containersActions } = this.props;
    const entity = generateContextEntityState(match.params);

    containersActions.fetchContainers({
      fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, params: { embed: 'apiendpoints' }, isPolling: true,
    });
  }

  populateContainer() {
    const { match, containerActions, containerModel } = this.props;

    containerActions.fetchContainer({ fqon: match.params.fqon, containerId: containerModel.id, isPolling: true });
  }

  destroy = () => {
    const { match, history, confirmContainerDelete, containerActions, containerModel, inContainerView, onDestroy } = this.props;
    const onSuccess = () => {
      if (inContainerView) {
        history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`);
      }
    };

    const modalAction = () => {
      containerActions.deleteContainer({ fqon: match.params.fqon, resource: containerModel, onSuccess });
      onDestroy();
    };

    confirmContainerDelete(modalAction, containerModel.name);
  }

  start = () => {
    const { match, containerActions, containerModel, inContainerView, onStart } = this.props;

    if (onStart) {
      onStart();
    }

    const onSuccess = () => {
      if (inContainerView) {
        this.populateContainer();
      } else {
        this.populateContainers();
      }
    };

    containerActions.scaleContainer({ fqon: match.params.fqon, containerId: containerModel.id, numInstances: 1, onSuccess });
  }

  suspend = () => {
    const { match, containerActions, containerModel, inContainerView, onSuspend } = this.props;

    if (onSuspend) {
      onSuspend();
    }

    const onSuccess = () => {
      if (inContainerView) {
        this.populateContainer();
      } else {
        this.populateContainers();
      }
    };

    containerActions.scaleContainer({ fqon: match.params.fqon, containerId: containerModel.id, numInstances: 0, onSuccess });
  }

  scale = () => {
    const { match, containerActions, scaleContainerModal, containerModel, inContainerView, onScale } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        this.populateContainer();
      } else {
        this.populateContainers();
      }
    };

    const modalAction = (numInstances) => {
      if (numInstances !== containerModel.properties.num_instances) {
        containerActions.scaleContainer({ fqon: match.params.fqon, containerId: containerModel.id, numInstances, onSuccess });
        onScale();
      }
    };

    scaleContainerModal(modalAction, containerModel.name, containerModel.properties.num_instances);
  }

  migrate = () => {
    const { match, containerActions, migrateContainerModal, containerModel, inContainerView, onMigrate } = this.props;

    const onSuccess = () => {
      if (inContainerView) {
        this.props.history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`);
      } else {
        this.populateContainers();
      }
    };

    const modalAction = (providerId) => {
      containerActions.migrateContainer({ fqon: match.params.fqon, containerId: containerModel.id, providerId, onSuccess });
      onMigrate();
    };

    migrateContainerModal(modalAction, containerModel.name, containerModel.properties.provider, inContainerView);
  }

  promote = () => {
    const { match, containerActions, promoteContainerModal, containerModel, hierarchyContextActions, onPromote } = this.props;

    // reroute and force immediate containers call to populate
    const onSuccess = environment => () => {
      this.props.history.replace(`/${match.params.fqon}/hierarchy/${environment.properties.workspace.id}/environment/${environment.id}/containers`);
      hierarchyContextActions.fetchContext({
        fqon: match.params.fqon,
        workspaceId: match.params.workspaceId,
        environmentId: match.params.environmentId,
        context: 'environment',
      });
      this.populateContainers();
    };

    const modalAction = (environment) => {
      containerActions.promoteContainer({ fqon: match.params.fqon, containerId: containerModel.id, environmentId: environment.id, onSuccess: onSuccess(environment) });
      onPromote();
    };

    promoteContainerModal(modalAction, containerModel.name, match.params);
  }

  render() {
    const {
      inContainerView,
      containerModel,
      disablePromote,
      disableDestroy,
      // actions,
      // actionsPending,
      // match,
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
            <ListItem className="container-action-button button--start" primaryText="Start" onClick={this.start} disabled={containerModel.properties.num_instances > 0} />
            <ListItem className="container-action-button button--suspend" primaryText="Suspend" onClick={this.suspend} disabled={containerModel.properties.num_instances === 0} />
            <ListItem className="container-action-button button--scale" primaryText="Scale" onClick={this.scale} />
            <ListItem primaryText="Migrate" onClick={this.migrate} />
            {!disablePromote &&
              <ListItem primaryText="Promote" onClick={this.promote} />}
            {!disableDestroy &&
              <ListItem className="container-action-button button--destroy" primaryText="Destroy" onClick={this.destroy} />}

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
          </Col>
        </Row>
      </ListWrapper>
    ];

    return (
      containerModel.id ?
        <ActionsWrapper inContainerView={inContainerView}>
          <StatusButton
            status={containerModel.properties.status}
            menuItems={menuItems}
            inMenu={!inContainerView}
          />
        </ActionsWrapper> : null
    );
  }
}

export default compose(
  withContainer({ unload: false }),
  withContainers({ unload: false }),
  withContext(),
  withEntitlements,
  withTheme,
  withRouter,
  connect(null, Object.assign({}, actionCreators)),
)(ContainerActions);

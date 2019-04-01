import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/FileCopy';
import CloneIcon from '@material-ui/icons/FilterNone';
import { EntitlementIcon } from 'components/Icons';
import Divider from 'components/Divider';
import { StatusButton } from 'components/Status';
import { Title, Subtitle } from 'components/Typography';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import NameModal from 'Modules/ModalRoot/Modals/NameModal';
import { generateContextEntityState } from 'util/helpers/context';
import { formatName } from 'util/forms';
import ScaleModal from '../ActionModals/Scale';
import MigrateModal from '../ActionModals/Migrate';
import PromoteModal from '../ActionModals/Promote';
import actionCreators from '../actions';
import withContext from '../../Hierarchy/hocs/withContext';
import withContainer from '../hocs/withContainer';
import withContainers from '../hocs/withContainers';
import containerDataModel from '../models/container';

const dividerStyle = { borderRight: '1px solid #e0e0e0' };

const ListItemTextStatus = styled(({ color, disabled, ...rest }) => <ListItemText {...rest} />)`
  ${props => !props.disabled && css`
    span {
      color: ${props.theme.colors[props.color]};
    }
  `}
`;

const ListWrapper = styled.div`
  min-width: 300px;
`;

const ListMenu = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

class ContainerActions extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    containerModel: PropTypes.object.isRequired,
    containerActions: PropTypes.object.isRequired,
    containersActions: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    inContainerView: PropTypes.bool,
    disableDestroy: PropTypes.bool,
    disablePromote: PropTypes.bool,
    disableMigrate: PropTypes.bool,
    disableScale: PropTypes.bool,
    disableEntitlements: PropTypes.bool,
    disableClone: PropTypes.bool,
    // actions: PropTypes.array.isRequired,
    // actionsPending: PropTypes.bool.isRequired,
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
    disableMigrate: false,
    disableScale: false,
    disableEntitlements: false,
    disableClone: false,
    editURL: null,
    onStart: () => {},
    onDestroy: () => {},
    onSuspend: () => {},
    onScale: () => {},
    onMigrate: () => {},
    onPromote: () => {},
  }

  static contextType = ModalContext;

  handleClone = () => {
    const { match, containersActions, containerModel, hierarchyContext } = this.props;
    const { context: { environment, environments } } = hierarchyContext;
    const { showModal } = this.context;

    const modalAction = ({ name, selectedTargetValue }) => {
      const payload = containerDataModel.create({ ...containerModel, name });
      const updateState = environment.id === selectedTargetValue;

      // containersActions.createContainers is handles container creation specifically for the listing screen
      containersActions.createContainers({ fqon: match.params.fqon, environmentId: selectedTargetValue, payload, updateState });
    };

    showModal(NameModal, {
      title: `Clone "${containerModel.name}" Container`,
      nameFormatter: formatName,
      proceedLabel: 'Clone',
      onProceed: modalAction,
      targetDropdownLabel: 'Select Environment',
      showTargetDropdown: true,
      targetDropdownValues: environments,
      defaultTargetValue: environment.id
    });
  }

  handleEntitlements = () => {
    const { containerModel } = this.props;
    const { showModal } = this.context;

    showModal(EntitlementModal, {
      title: `Entitlements for "${containerModel.name}" Container`,
      fqon: containerModel.org.properties.fqon,
      entityId: containerModel.id,
      entityKey: 'containers',
    });
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
    const { match, history, containerActions, containerModel, inContainerView, onDestroy } = this.props;
    const { showModal } = this.context;
    const onSuccess = () => {
      if (inContainerView) {
        history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`);
      }
    };

    const modalAction = ({ force }) => {
      containerActions.deleteContainer({ fqon: match.params.fqon, resource: containerModel, onSuccess, force });
      onDestroy();
    };

    showModal(ConfirmModal, {
      title: `Are you sure you want to destroy ${containerModel.name}?`,
      onProceed: modalAction,
    });
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
    const { match, containerActions, containerModel, inContainerView, onScale } = this.props;
    const { showModal } = this.context;

    const onSuccess = () => {
      if (inContainerView) {
        this.populateContainer();
      } else {
        this.populateContainers();
      }
    };

    const onProceed = (numInstances) => {
      if (numInstances !== containerModel.properties.num_instances) {
        containerActions.scaleContainer({ fqon: match.params.fqon, containerId: containerModel.id, numInstances, onSuccess });
        onScale();
      }
    };

    showModal(ScaleModal, {
      title: containerModel.name,
      numInstances: containerModel.properties.num_instances,
      onProceed,
    });
  }

  migrate = () => {
    const { match, containerActions, containerModel, inContainerView, onMigrate } = this.props;
    const { showModal } = this.context;

    const onSuccess = () => {
      if (inContainerView) {
        this.props.history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`);
      } else {
        this.populateContainers();
      }
    };

    const onProceed = (providerId) => {
      containerActions.migrateContainer({ fqon: match.params.fqon, containerId: containerModel.id, providerId, onSuccess });
      onMigrate();
    };

    showModal(MigrateModal, {
      title: containerModel.name,
      sourceProvider: containerModel.properties.provider,
      inContainerView,
      onProceed,
    });
  }

  promote = () => {
    const { match, containerActions, containerModel, hierarchyContextActions, onPromote } = this.props;
    const { showModal } = this.context;

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

    const onProceed = (environment) => {
      containerActions.promoteContainer({ fqon: match.params.fqon, containerId: containerModel.id, environmentId: environment.id, onSuccess: onSuccess(environment) });
      onPromote();
    };

    showModal(PromoteModal, {
      title: containerModel.name,
      sourceProvider: containerModel.properties.provider,
      onProceed,
    });
  }

  render() {
    const {
      inContainerView,
      containerModel,
      disablePromote,
      disableDestroy,
      disableMigrate,
      disableScale,
      disableEntitlements,
      disableClone,
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

            <Divider />
          </Col>

          <Col flex={6} style={dividerStyle}>
            {!disableScale && (
              <React.Fragment>
                <ListItem
                  button
                  dense
                  onClick={this.start}
                  disabled={containerModel.properties.num_instances > 0}
                >
                  <ListItemTextStatus primary="Start" color="success" disabled={containerModel.properties.num_instances > 0} />
                </ListItem>

                <ListItem
                  button
                  dense
                  onClick={this.suspend}
                  disabled={containerModel.properties.num_instances === 0}
                >
                  <ListItemTextStatus primary="Suspend" color="warning" disabled={containerModel.properties.num_instances === 0} />
                </ListItem>

                <ListItem
                  button
                  dense
                  onClick={this.scale}
                >
                  <ListItemTextStatus primary="Scale" color="info" />
                </ListItem>
              </React.Fragment>
            )}

            {!disableMigrate && (
              <ListItem
                button
                dense
                onClick={this.migrate}
              >
                <ListItemText primary="Migrate" />
              </ListItem>
            )}

            {!disablePromote && (
              <ListItem
                button
                dense
                onClick={this.promote}
              >
                <ListItemText primary="Promote" />
              </ListItem>
            )}

            {!disableDestroy && (
              <ListItem
                button
                dense
                onClick={this.destroy}
              >
                <ListItemTextStatus primary="Destroy" color="error" />
              </ListItem>
            )}
          </Col>

          <Col flex={6}>
            {!inContainerView && (
              <ListItem
                button
                dense
                to={this.props.editURL}
                component={Link}
              >
                <EditIcon fontSize="small" color="action" />
                <ListItemText primary="Edit" />
              </ListItem>
            )}

            <ListItem
              button
              dense
              onClick={this.handleEntitlements}
              disabled={disableEntitlements}
            >
              <EntitlementIcon size={20} />
              <ListItemText primary="Entitlements" />
            </ListItem>

            <CopyToClipboard text={containerModel.id}>
              <ListItem button dense>
                <CopyIcon fontSize="small" color="action" />
                <ListItemText primary="Copy UUID" />
              </ListItem>
            </CopyToClipboard>

            {!inContainerView && (
              <ListItem
                button
                dense
                onClick={this.handleClone}
                disabled={disableClone}
              >
                <CloneIcon fontSize="small" color="action" />
                <ListItemText primary="Clone" />
              </ListItem>
            )}
          </Col>
        </Row>
      </ListWrapper>
    ];


    if (containerModel.id) {
      return (
        <StatusButton
          status={containerModel.properties.status}
          asButton={inContainerView}
        >
          {menuItems}
        </StatusButton>
      );
    }

    return null;
  }
}

export default compose(
  withContainer({ unload: false }),
  withContainers({ unload: false }),
  withContext(),
  withRouter,
  connect(null, Object.assign({}, actionCreators)),
)(ContainerActions);

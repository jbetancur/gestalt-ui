import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Divider from 'components/Divider';
import { DeleteIcon, EntitlementIcon, WorkspaceIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';

class WorkspaceDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  // TODO: will fix when react-router fixes hoisting error
  // static contextType = ModalConsumer;

  showEntitlements = () => {
    const { hierarchyContext } = this.props;
    const { showModal } = this.context;
    const { context: { workspace } } = hierarchyContext;

    const name = workspace.description || workspace.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Workspace`,
      fqon: workspace.org.properties.fqon,
      entityId: workspace.id,
      entityKey: 'workspaces',
    });
  }

  delete = () => {
    const { hierarchyContext, match, history, hierarchyContextActions } = this.props;
    const { showModal } = this.context;
    const { context: { workspace } } = hierarchyContext;
    const name = workspace.description || workspace.name;
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Workspace`,
      values: { name, type: 'Workspace' },
      requireConfirm: true,
      important: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteWorkspace({ fqon: match.params.fqon, resource: workspace, onSuccess, params: { force } }),
    });
  }

  renderActions() {
    const { hierarchyContext } = this.props;
    const { context: { workspace } } = hierarchyContext;

    return (
      <MenuButton
        id="environment--details--actions"
        flat
        flatColor="info"
        label="Actions"
        iconAfter
        icon={<ArrowDropDownIcon fontSize="small" />}
      >
        <ListItem dense button onClick={this.showEntitlements}>
          <EntitlementIcon size={20} />
          <ListItemText primary="Entitlements" />
        </ListItem>
        <ListItem dense button component={Link} to={{ pathname: `/${workspace.org.properties.fqon}/hierarchy/${workspace.id}/edit`, state: { modal: true } }}>
          <EditIcon color="action" fontSize="small" />
          <ListItemText primary="Edit" />
        </ListItem>
        <Divider />
        <ListItem dense button onClick={this.delete}>
          <DeleteIcon size={20} />
          <ListItemText primary="Delete" />
        </ListItem>
      </MenuButton>
    );
  }

  render() {
    const { hierarchyContext } = this.props;
    const { context: { workspace } } = hierarchyContext;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={`${workspace.description || workspace.name} Details`}
          titleIcon={<WorkspaceIcon />}
          actions={this.renderActions()}
        />
        <DetailsPane model={workspace} singleRow />
      </React.Fragment>
    );
  }
}

export default withRouter(WorkspaceDetails);

// TODO: Place here to fix hoisting issue
WorkspaceDetails.contextType = ModalConsumer;

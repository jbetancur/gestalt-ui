import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Divider from 'components/Divider';
import { DeleteIcon, EntitlementIcon, EnvironmentIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';

class EnvironmentDetails extends PureComponent {
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
    const { context: { environment } } = hierarchyContext;
    const name = environment.description || environment.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Environment`,
      fqon: environment.org.properties.fqon,
      entityId: environment.id,
      entityKey: 'environments',
    });
  }

  delete = () => {
    const { hierarchyContext, match, history, hierarchyContextActions } = this.props;
    const { showModal } = this.context;
    const { context: { environment } } = hierarchyContext;
    const name = environment.description || environment.name;
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments`);

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Environment`,
      values: { name, type: 'Environment' },
      requireConfirm: true,
      important: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteEnvironment({ fqon: match.params.fqon, resource: environment, onSuccess, params: { force } }),
    });
  }

  renderActions() {
    const { hierarchyContext } = this.props;
    const { context: { environment } } = hierarchyContext;

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
        <ListItem dense button component={Link} to={{ pathname: `/${environment.org.properties.fqon}/hierarchy/${environment.properties.workspace.id}/environment/${environment.id}/edit`, state: { modal: true } }}>
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
    const { context: { environment } } = hierarchyContext;
    const environmentType = environment.id && environment.properties ? environment.properties.environment_type : null;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={`${environment.description || environment.name} Details`}
          titleIcon={<EnvironmentIcon />}
          subtitle={`type: ${environmentType}`}
          actions={this.renderActions()}
        />
        <DetailsPane model={environment} singleRow />
      </React.Fragment>
    );
  }
}

export default withRouter(EnvironmentDetails);
// TODO: Place here to fix hoisting issue
EnvironmentDetails.contextType = ModalConsumer;
